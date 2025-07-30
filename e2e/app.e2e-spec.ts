import { QlezboothPage } from './app.po';

describe('qlezbooth App', function() {
  let page: QlezboothPage;

  beforeEach(() => {
    page = new QlezboothPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
