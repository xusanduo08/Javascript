import { CommunicatePage } from './app.po';

describe('communicate App', () => {
  let page: CommunicatePage;

  beforeEach(() => {
    page = new CommunicatePage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
