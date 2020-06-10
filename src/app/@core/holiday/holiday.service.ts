import { Injectable } from '@angular/core';
import { IHierarchyCalculator, HierarchyCalculator, IHierarchy, IHoliday } from '@jbouduin/holidays-lib';
import { from, Observable } from 'rxjs';

import { FileProvider } from './file-provider';

@Injectable({
  providedIn: 'root'
})
export class HolidayService  {

  private calculator: IHierarchyCalculator;

  public constructor(fp: FileProvider) {
    this.calculator = new HierarchyCalculator('en', fp);
  }

  public getHierarchyTree(): Observable<Array<IHierarchy>> {
    return from(this.calculator.getHierarchyTree());
  }

  public getHolidays(hierarchy: string, year: number, deep: boolean): Observable<Array<IHoliday>> {
    return from(this.calculator.getHolidays(hierarchy, year, deep));
  }
}
