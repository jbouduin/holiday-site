import { Component, OnInit, Input } from '@angular/core';

import { I18nService } from './i18n.service';

@Component({
  selector: 'app-language-selector',
  templateUrl: './language-selector.component.html',
  styleUrls: ['./language-selector.component.scss']
})
export class LanguageSelectorComponent implements OnInit {
  @Input() public icon = false;

  public constructor(
    private i18nService: I18nService
  ) { }

  public ngOnInit() { }

  public setLanguage(language: string) {
    this.i18nService.language = language;
  }

  public get currentLanguage(): string {
    return this.i18nService.language;
  }

  public get languages(): string[] {
    return this.i18nService.supportedLanguages;
  }

}
