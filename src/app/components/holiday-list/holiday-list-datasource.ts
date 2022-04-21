import { DataSource } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { map } from 'rxjs/operators';
import { Observable, merge } from 'rxjs';
import { HolidayListItem } from './holiday-list-item';
import { HolidayService } from 'src/app/services/holiday.service';
import { IHierarchy, IHoliday } from '@jbouduin/holidays-lib';


export class HolidayListDataSource extends DataSource<HolidayListItem> {

  //#region Private properties ------------------------------------------------
  private data: Array<HolidayListItem>;
  private readonly holidayService: HolidayService;
  private readonly hierarchyTranslations: Map<string, Array<string>>;
  //#endregion

  //#region Public properties -------------------------------------------------
  public paginator: MatPaginator | undefined;
  public sort: MatSort | undefined;
  //#endregion

  //#region Getters -----------------------------------------------------------
  //#endregion

  //#region Constructor & C° --------------------------------------------------
  constructor(holidayService: HolidayService) {
    super();
    this.holidayService = holidayService;
    this.data = new Array<HolidayListItem>();
    this.hierarchyTranslations = new Map<string, Array<string>>();
    this.holidayService.getHierarchyTree.subscribe((tree: Array<IHierarchy>) => {
      this.hierarchyTranslations.clear();
      this.fillHierarchyTranslations(tree, new Array<string>());
    });
  }
  //#endregion

  //#region Public methods ----------------------------------------------------
  public changeSelection(hierarchy: IHierarchy, year: number): void {
    void this.holidayService.changeSelection(hierarchy, year);
  }

  public connect(): Observable<Array<HolidayListItem>> {
    if (this.paginator && this.sort) {
      // Combine everything that affects the rendered data into one update
      // stream for the data-table to consume.
      return merge(this.holidayService.getHolidays, this.paginator.page, this.sort.sortChange)
        .pipe(map((observing) => {
          if (Array.isArray(observing)) {
            this.data = observing.map((holiday: IHoliday) => {
              const translation = this.hierarchyTranslations.get(holiday.fullPath);
              const location = translation ? translation[translation.length - 1] : '';
              return new HolidayListItem(holiday.date, holiday.key, location, holiday.name)});
          }
          if (this.paginator) {
            this.paginator.length = this.data.length;
          }
          return this.getPagedData(this.getSortedData([...this.data]));
        }));
    } else {
      throw Error('Please set the paginator and sort on the data source before connecting.');
    }
  }

  /* eslint-disable-next-line @typescript-eslint/no-empty-function */
  public disconnect(): void { }

  public fullTranslatedPath(fullPath: string): Array<string> {
    return this.hierarchyTranslations.get(fullPath) || new Array<string>();
  }
  //#endregion

  //#region Private methods ---------------------------------------------------
  private fillHierarchyTranslations(list: Array<IHierarchy>, parentTranslations: Array<string>): void {
    list.forEach((item: IHierarchy) => {
      const translations = new Array<string>(
        ...parentTranslations,
        item.description
      );
      this.hierarchyTranslations.set(item.fullPath, translations);
      if (item.children) {
        this.fillHierarchyTranslations(item.children, translations);
      }
    });
  }

  private getPagedData(data: Array<HolidayListItem>): Array<HolidayListItem> {
    if (this.paginator) {
      const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
      return data.splice(startIndex, this.paginator.pageSize);
    } else {
      return data;
    }
  }

  private getSortedData(data: Array<HolidayListItem>): Array<HolidayListItem> {
    let isAsc: boolean;
    let sortBy: string;

    if (!this.sort || !this.sort.active || this.sort.direction === '') {
      isAsc = true;
      sortBy = 'date';
    } else {
      isAsc = this.sort?.direction === 'asc';
      sortBy = this.sort?.active
    }

    return data.sort((a: HolidayListItem, b: HolidayListItem) => {
      switch (sortBy) {
        case 'name': return this.compare(a.name, b.name, isAsc);
        case 'location': return this.compare(a.location, b.location, isAsc);
        case 'date':
        default: return this.compare(a.date.getTime(), b.date.getTime(), isAsc);
      }
    });
  }

  private compare(a: string | number, b: string | number, isAsc: boolean): number {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }
  //#endregion
}
