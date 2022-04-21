import { AfterViewInit, Component, Input, OnChanges, OnDestroy, SimpleChanges, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { IHierarchy } from '@jbouduin/holidays-lib';
import { Subscription } from 'rxjs';
import { HolidayService } from 'src/app/services/holiday.service';
import { versionInfo } from 'src/environments/version-info';
import { HolidayListDataSource } from './holiday-list-datasource';
import { HolidayListItem } from './holiday-list-item';

@Component({
  selector: 'app-holiday-list',
  templateUrl: './holiday-list.component.html',
  styleUrls: ['./holiday-list.component.scss']
})
export class HolidayListComponent implements AfterViewInit, OnChanges, OnDestroy {

  //#region @Input/@Output/@ViewChild -----------------------------------------
  @Input() public selectedHierarchy: IHierarchy | undefined;
  @Input() public selectedYear: number | undefined;

  @ViewChild(MatPaginator) public paginator!: MatPaginator;
  @ViewChild(MatSort) public sort!: MatSort;
  @ViewChild(MatTable) public table!: MatTable<HolidayListItem>;
  //#endregion

  //#region Private properties ------------------------------------------------
  private readonly dataSource: HolidayListDataSource;
  private readonly pathChangedSubscription: Subscription;
  //#endregion

  //#region Public properties -------------------------------------------------
  public currentHierarchy: string | undefined;
  public readonly displayedColumns: Array<string>;
  public readonly libVersion: string;
  //#endregion

  //#region Constructor & C° --------------------------------------------------
  constructor(holidayService: HolidayService) {
    this.dataSource = new HolidayListDataSource(holidayService);
    this.displayedColumns = ['date', 'location', 'name'];
    this.currentHierarchy = undefined;
    this.selectedHierarchy = undefined;
    this.selectedYear = undefined;
    this.libVersion = `Using @jbouduin/holiday-lib v${versionInfo.libVersion}`
    this.pathChangedSubscription = holidayService.fullTranslatedPathChanged
      .subscribe((path: Array<string> | undefined) => this.currentHierarchy = path ? path.join(' > ') : undefined)
  }

  public ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
  }

  public ngOnChanges(_changes: SimpleChanges): void {
    if (this.selectedHierarchy && this.selectedYear) {
      this.dataSource.changeSelection(this.selectedHierarchy, this.selectedYear);
    }
  }

  public ngOnDestroy(): void {
    this.pathChangedSubscription.unsubscribe();
  }
  //#endregion
}
