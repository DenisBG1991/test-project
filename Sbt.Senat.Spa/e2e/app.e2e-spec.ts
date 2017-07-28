import { SbtSenatSpaPage } from './app.po';

describe('sbt-senat-spa App', function() {
  let page: SbtSenatSpaPage;

  beforeEach(() => {
    page = new SbtSenatSpaPage();
  });

  it('should display login', () => {
    page.navigateTo();
    expect(page.getLoginLabel()).toEqual('login');
  });
});
