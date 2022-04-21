import { Injectable } from '@angular/core';
import { HierarchyCalculator, IHierarchy, IHierarchyCalculator, IHoliday } from '@jbouduin/holidays-lib';
import { from, Observable, Subject } from 'rxjs';
import { FileProviderService } from './file-provider.service';

@Injectable({
  providedIn: 'root'
})
export class HolidayService {

  //#region private properties ------------------------------------------------
  private readonly holidays: Subject<Array<IHoliday>>;
  private readonly hierarchy: Subject<Array<IHierarchy>>;
  private readonly fp: FileProviderService;
  private _currentLanguage: string;
  private calculator: IHierarchyCalculator;
  private currentHierarchy: IHierarchy | undefined;
  private currentYear: number | undefined;
  //#endregion

  //#region Public properties -------------------------------------------------
  public getHolidays: Observable<Array<IHoliday>>;
  public getHierarchyTree: Observable<Array<IHierarchy>>;
  //#endregion

  //#region Setters/Getters ---------------------------------------------------
  public set currentLanguage(value: string) {
    this._currentLanguage = value;
    this.calculator = new HierarchyCalculator(this._currentLanguage, this.fp);
    this.fetchHierarchyTree();
    this.fetchHoldidays();
  }

  public get currentLanguage(): string {
    return this._currentLanguage;
  }
  //#endregion

  //#region Constructor & C° --------------------------------------------------
  public constructor(fp: FileProviderService) {
    this.fp = fp;
    this._currentLanguage = 'en';
    this.calculator = new HierarchyCalculator(this._currentLanguage, fp);
    this.holidays = new Subject<Array<IHoliday>>();
    this.hierarchy = new Subject<Array<IHierarchy>>();
    this.getHolidays = from(this.holidays);
    this.getHierarchyTree = from(this.hierarchy);
  }
  //#endregion

  //#region Public methods ----------------------------------------------------
  public async changeSelection(hierarchy: IHierarchy, year: number): Promise<void> {
    this.currentHierarchy = hierarchy;
    this.currentYear = year;
    this.fetchHoldidays();
  }

  public getSupportedLanguages(): Observable<Array<string>> {
    return from(this.calculator.getSupportedLanguages());
  }
  //#endregion

  //#region Private methods ---------------------------------------------------
  private async fetchHoldidays(): Promise<void> {
    if (this.currentHierarchy && this.currentYear) {
      const result = await this.calculator.getHolidays(this.currentHierarchy.fullPath, this.currentYear, false);
      this.holidays.next(result);
    }
  }

  private async fetchHierarchyTree(): Promise<void> {
    const result = await this.calculator.getHierarchyTree();
    this.hierarchy.next(result);
  }
  //#endregion
}
