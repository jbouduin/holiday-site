import { Injectable } from '@angular/core';
import { HierarchyCalculator, IHierarchy, IHierarchyCalculator, IHoliday } from '@jbouduin/holidays-lib';
import { from, Observable, Subject } from 'rxjs';
import { FileProviderService } from './file-provider.service';

@Injectable({
  providedIn: 'root'
})
export class HolidayService {

  //#region private properties ------------------------------------------------
  private readonly fullTranslatedPath: Subject<Array<string> | undefined>;
  private readonly fp: FileProviderService;
  private readonly holidays: Subject<Array<IHoliday>>;
  private readonly hierarchy: Subject<Array<IHierarchy>>;
  private _currentLanguage: string;
  private calculator: IHierarchyCalculator;
  private currentHierarchy: IHierarchy | undefined;
  private currentYear: number | undefined;

  //#endregion

  //#region Public properties -------------------------------------------------
  public fullTranslatedPathChanged: Observable<Array<string> | undefined>;
  public getHolidays: Observable<Array<IHoliday>>;
  public getHierarchyTree: Observable<Array<IHierarchy>>;
  public hierarchyTranslations: Map<string, Array<string>>;
  //#endregion

  //#region Setters/Getters ---------------------------------------------------
  public set currentLanguage(value: string) {
    this._currentLanguage = value;
    this.calculator = new HierarchyCalculator(this._currentLanguage, this.fp);
    void this.fetchHierarchyTree();
    void this.fetchHolidays();
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
    this.fullTranslatedPath = new Subject<Array<string> | undefined>();
    this.holidays = new Subject<Array<IHoliday>>();
    this.hierarchy = new Subject<Array<IHierarchy>>();
    this.hierarchyTranslations = new Map<string, Array<string>>();
    this.fullTranslatedPathChanged = from(this.fullTranslatedPath);
    this.getHolidays = from(this.holidays);
    this.getHierarchyTree = from(this.hierarchy);
  }
  //#endregion

  //#region Public methods ----------------------------------------------------
  public changeSelection(hierarchy: IHierarchy, year: number): void {
    this.currentHierarchy = hierarchy;
    this.currentYear = year;
    void this.fetchHolidays();
  }

  public getSupportedLanguages(): Observable<Array<string>> {
    return from(this.calculator.getSupportedLanguages());
  }
  //#endregion

  //#region Private methods ---------------------------------------------------
  private async fetchHolidays(): Promise<void> {
    if (this.currentHierarchy && this.currentYear) {
      const result = await this.calculator.getHolidays(this.currentHierarchy.fullPath, this.currentYear, false);
      this.holidays.next(result);
      if (this.currentHierarchy) {
        this.fullTranslatedPath.next(this.hierarchyTranslations.get(this.currentHierarchy.fullPath))
      }
    }
  }

  private async fetchHierarchyTree(): Promise<void> {
    const result = await this.calculator.getHierarchyTree();
    this.fillHierarchyTranslations(result, new Array<string>());
    this.hierarchy.next(result);
    if (this.currentHierarchy) {
      this.fullTranslatedPath.next(this.hierarchyTranslations.get(this.currentHierarchy.fullPath))
    }
  }

  private fillHierarchyTranslations(list: Array<IHierarchy>, parentTranslations: Array<string>): void {
    list.forEach((item: IHierarchy) => {
      const translations = new Array<string>(
        ...parentTranslations,
        item.description
      );
      this.hierarchyTranslations.set(item.fullPath, translations);
      if (item.children) {
        this.fillHierarchyTranslations(item.children, translations);
      }
    });
  }
  //#endregion
}
