/*
 * Use the Page Object pattern to define the page under test.
 * See docs/coding-guide/e2e-tests.md for more info.
 */

import { browser, element, by } from 'protractor';

export class AppSharedPage {
  public async navigateAndSetLanguage() {
    // Forces default language
    await this.navigateTo();
    await browser.executeScript(() => localStorage.setItem('language', 'en-US'));
  }

  public async navigateTo() {
    await browser.get('/');
  }
}
