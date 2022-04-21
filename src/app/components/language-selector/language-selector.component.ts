import { Component } from '@angular/core';
import { HolidayService } from 'src/app/services/holiday.service';

@Component({
  selector: 'app-language-selector',
  templateUrl: './language-selector.component.html',
  styleUrls: ['./language-selector.component.scss']
})
export class LanguageSelectorComponent {

  //#region private properties ------------------------------------------------
  private holidayService: HolidayService;
  //#endregion

  //#region public properties -------------------------------------------------
  public supportedLanguages: Array<string>;
  //#endregion

  //#region Getters -----------------------------------------------------------
  public get currentLanguage(): string {
    return this.holidayService.currentLanguage;
  }
  //#endregion

  //#region Constructor & C° --------------------------------------------------
  constructor(holidayService: HolidayService) {
    this.holidayService = holidayService;
    this.supportedLanguages = new Array<string>();
    this.holidayService.getSupportedLanguages().subscribe((result: Array<string>) => this.supportedLanguages = result);
  }
  //#endregion

  //#region UI-triggered methods ----------------------------------------------
  public setLanguage(language: string) {
    this.holidayService.currentLanguage = language;
  }

  public isCurrentLanguage(language: string) {
    return language === this.holidayService.currentLanguage;
  }
  //#endregion
}
