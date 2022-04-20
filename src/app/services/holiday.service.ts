import { Injectable } from '@angular/core';
import { HierarchyCalculator, IHierarchy, IHierarchyCalculator, IHoliday } from '@jbouduin/holidays-lib';
import { from, Observable, Subject } from 'rxjs';
import { FileProviderService } from './file-provider.service';

@Injectable({
  providedIn: 'root'
})
export class HolidayService {

  private readonly calculator: IHierarchyCalculator;
  private readonly holidays: Subject<Array<IHoliday>>;
  public getHolidays: Observable<Array<IHoliday>>;

  public constructor(fp: FileProviderService) {
    this.calculator = new HierarchyCalculator('en', fp);
    this.holidays = new Subject<Array<IHoliday>>();
    this.getHolidays = from(this.holidays)
  }

  public async changeSelection(hierarchy: IHierarchy, year: number): Promise<void> {
    const result = await this.calculator.getHolidays(hierarchy.fullPath, year, false);
    this.holidays.next(result)
  }

  public getHierarchyTree(): Observable<Array<IHierarchy>> {
    return from(this.calculator.getHierarchyTree());
  }

}
