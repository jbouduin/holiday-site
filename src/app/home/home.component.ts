import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';
import * as Collections from 'typescript-collections';

import { HolidayService } from '@core';
import { IHierarchy, IHoliday } from '@jbouduin/holidays-lib';
import { HolidayListItem } from './holiday-list-item';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  // <editor-fold desc='Private properties'>
  private holidayService: HolidayService;
  private readonly hierarchyTranslations: Collections.Dictionary<string, string>
  private selectedHierarchy: IHierarchy | undefined;
  // </editor-fold>

  // <editor-fold desc='Public properties'>
  public isLoading: boolean;
  public formGroup: FormGroup;
  public hierarchyTree: Array<IHierarchy>;
  public holidays: Array<HolidayListItem>;
  // </editor-fold>

  // <editor-fold desc='constructor'>
  public constructor(formBuilder: FormBuilder, holidayService: HolidayService) {
    this.isLoading = false;
    this.holidayService = holidayService;
    this.hierarchyTree = new Array<IHierarchy>();
    this.holidays = new Array<HolidayListItem>();
    this.hierarchyTranslations = new Collections.Dictionary<string, string>();
    this.formGroup = formBuilder.group({
      year: ['2020', [ Validators.required, Validators.pattern('^[+-](0|[1-9][0-9]*)$') ]]
    });
  }
  // </editor-fold>

  // <editor-fold desc='Angular interface methods'>
  public ngOnInit() {
    this.isLoading = true;
    this.holidayService.getHierarchyTree()
      .pipe(finalize(() => { this.isLoading = false; }))
      .subscribe( (tree: Array<IHierarchy>) => {
        this.hierarchyTranslations.clear();
        this.fillHierarchyTranslations(tree);
        this.hierarchyTree = tree;
      });
  }
  // </editor-fold>

  // <editor-fold desc='UI Triggered methods'>
  public yearDown(): void {
    this.formGroup.get('year').patchValue(Number.parseInt(this.formGroup.value.year) - 1);
    this.loadHolidays();
  }

  public yearUp(): void {
    this.formGroup.get('year').patchValue(Number.parseInt(this.formGroup.value.year) + 1);
    this.loadHolidays();
  }

  public hierarchySelected(hierarchy: IHierarchy) {
    this.selectedHierarchy = hierarchy;
    this.loadHolidays();
  }
  // </editor-fold>

  // <editor-fold desc='Private methods'>
  private loadHolidays(): void {
    const year = Number.parseInt(this.formGroup.value.year);
    if (year && this.selectedHierarchy){
      this.holidayService
        .getHolidays(this.selectedHierarchy.fullPath, year, true)
        .subscribe( (h: Array<IHoliday>) => this.holidays = this.flattenHolidayList(h));}
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
  // </editor-fold>
}
