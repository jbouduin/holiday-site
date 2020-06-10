import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';
import * as Collections from 'typescript-collections';

import { HolidayService } from '@core';
// import { QuoteService } from './quote.service';
import { IHierarchy, IHoliday } from '@jbouduin/holidays-lib';
import { HolidayListItem } from './holiday-list-item';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  public quote: string | undefined;
  public isLoading: boolean;
  public hierarchyTree: Array<IHierarchy>;
  public holidays: Array<HolidayListItem>;
  private holidayService: HolidayService;
  private hierarchyTranslations: Collections.Dictionary<string, string>
  // private quoteService: QuoteService;

  public constructor(holidayService: HolidayService) {
    this.isLoading = false;
    this.holidayService = holidayService;
    // this.quoteService = quoteService;
    this.hierarchyTree = new Array<IHierarchy>();
    this.holidays = new Array<HolidayListItem>();
    this.hierarchyTranslations = new Collections.Dictionary<string, string>();
  }

  public ngOnInit() {
    this.isLoading = true;
    // this.quoteService.getRandomQuote({ category: 'dev' })
    //   .pipe(finalize(() => { this.isLoading = false; }))
    //   .subscribe((quote: string) => { this.quote = quote; });
    this.holidayService.getHierarchyTree()
      .pipe(finalize(() => { this.isLoading = false; }))
      .subscribe( (tree: Array<IHierarchy>) => {
        this.hierarchyTranslations = new Collections.Dictionary<string, string>();
        this.fillHierarchyTranslations(tree);
        this.hierarchyTree = tree;
      });
  }

  public hierarchySelected(hierarchy: IHierarchy) {
    console.log('selected hierarchy', hierarchy);
    this.holidayService
      .getHolidays(hierarchy.fullPath, 2020, true)
      .subscribe(h => this.holidays = this.flattenHolidayList(h));
  }

  private fillHierarchyTranslations(list: Array<IHierarchy>): void {
    list.forEach( (item: IHierarchy) => {
      this.hierarchyTranslations.setValue(item.fullPath, item.description);
      if (item.children){
        this.fillHierarchyTranslations(item.children);
      }
    });
  }
  private flattenHolidayList(list: Array<IHoliday>): Array<HolidayListItem> {
    // first sort the list by date/hierarchy
    list.sort( (item1: IHoliday, item2: IHoliday) => {
      if (item1.date.valueOf() < item2.date.valueOf()) {
        return -1;
      } else if (item1.date.valueOf() > item2.date.valueOf()) {
        return 1;
      } else {
        if (item1.fullPath < item2.fullPath) {
          return -1;
        } else if (item1.fullPath > item2.fullPath) {
          return 1;
        }
        return 0;
      }
    });
    console.log(list);
    const result = new Array<HolidayListItem>();
    list.forEach(item => {
      const existing = result.filter(f => f.key === item.key && f.date.valueOf() === item.date.valueOf());
      const location = this.hierarchyTranslations.getValue(item.fullPath) || item.hierarchy;
      if (existing.length > 0) {
        existing[0].location += `, ${location}`;
      } else {
        result.push(new HolidayListItem(item.date, item.key, location, item.name));
      }
    })
    return result;
  }
}
