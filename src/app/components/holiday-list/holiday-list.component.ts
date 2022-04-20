import { AfterViewInit, Component, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { IHierarchy } from '@jbouduin/holidays-lib';
import { HolidayService } from 'src/app/services/holiday.service';
import { HolidayListDataSource } from './holiday-list-datasource';
import { HolidayListItem } from './holiday-list-item';

@Component({
  selector: 'app-holiday-list',
  templateUrl: './holiday-list.component.html',
  styleUrls: ['./holiday-list.component.scss']
})
export class HolidayListComponent implements AfterViewInit, OnChanges {

  //#region @Input/@Output/@ViewChild -----------------------------------------
  @Input() public selectedHierarchy: IHierarchy | undefined;
  @Input() public selectedYear: number | undefined;

  @ViewChild(MatPaginator) public paginator!: MatPaginator;
  @ViewChild(MatSort) public sort!: MatSort;
  @ViewChild(MatTable) public table!: MatTable<HolidayListItem>;
  //#endregion

  //#region Private properties ------------------------------------------------
  private readonly dataSource: HolidayListDataSource;
  //#endregion

  //#region Public properties -------------------------------------------------
  public readonly displayedColumns: Array<string>;
  public currentHierarchy: string | undefined;
  //#endregion

  //#region Constructor & C° --------------------------------------------------
  constructor(holidayService: HolidayService) {
    this.dataSource = new HolidayListDataSource(holidayService);
    this.displayedColumns = ['date', 'location', 'name'];
    this.selectedHierarchy = undefined;
    this.selectedYear = undefined;
    this.currentHierarchy = undefined;
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
  }

  ngOnChanges(_changes: SimpleChanges): void {
    if (this.selectedHierarchy) {
      this.currentHierarchy = this.dataSource.fullTranslatedPath(this.selectedHierarchy.fullPath).join(' - ');
      if (this.selectedYear) {
        this.dataSource.changeSelection(this.selectedHierarchy, this.selectedYear);
      }
    }
  }
  //#endregion
}
