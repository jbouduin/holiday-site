import { Component, Input, OnInit } from '@angular/core';
import { HolidayListItem } from '../holiday-list-item';

@Component({
  selector: 'app-holiday-list',
  templateUrl: './holiday-list.component.html',
  styleUrls: ['./holiday-list.component.scss']
})
export class HolidayListComponent implements OnInit {

  // <editor-fold desc='@Input'>
  @Input() public holidays: Array<HolidayListItem>;
  // </editor-fold>

  // <editor-fold desc='Public properties'>
  public displayedColumns: string[];
  // </editor-fold>
  //
  // <editor-fold desc='constructor'>
  public constructor() {
    this.displayedColumns = [ "date", "location", "name" ];
    this.holidays = new Array<HolidayListItem>()
  }
  // </editor-fold>

  // <editor-fold desc='Angular interface methods'>
  public ngOnInit(): void { }
  // </editor-fold>

}
