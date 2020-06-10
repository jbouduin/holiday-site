import { Component, Input, OnInit } from '@angular/core';
import { HolidayListItem } from '../holiday-list-item';

@Component({
  selector: 'app-holiday-list',
  templateUrl: './holiday-list.component.html',
  styleUrls: ['./holiday-list.component.scss']
})
export class HolidayListComponent implements OnInit {

  @Input() public holidays: Array<HolidayListItem>;
  public displayedColumns: string[];

  constructor() {
    this.displayedColumns = [ "date", "location", "name" ];
    this.holidays = new Array<HolidayListItem>()
  }

  ngOnInit(): void {
  }

}
