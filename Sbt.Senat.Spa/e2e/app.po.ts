import { browser, element, by } from 'protractor';

export class SbtSenatSpaPage {
  navigateTo() {
    return browser.get('/');
  }

  getLoginLabel() {
      return element(by.className('login')).getText();
  }
}
