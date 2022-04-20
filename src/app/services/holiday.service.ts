import { Injectable } from '@angular/core';
import { HierarchyCalculator, IHierarchy, IHierarchyCalculator, IHoliday } from '@jbouduin/holidays-lib';
import { from, Observable } from 'rxjs';
import { FileProviderService } from './file-provider.service';

@Injectable({
  providedIn: 'root'
})
export class HolidayService {

  private readonly calculator: IHierarchyCalculator;

  public constructor(fp: FileProviderService) {
    this.calculator = new HierarchyCalculator('en', fp);
  }

  public getHierarchyTree(): Observable<Array<IHierarchy>> {
    return from(this.calculator.getHierarchyTree());
  }

  public getHolidays(hierarchy: string, year: number, deep: boolean): Observable<Array<IHoliday>> {
    return from(this.calculator.getHolidays(hierarchy, year, deep));
  }

}
