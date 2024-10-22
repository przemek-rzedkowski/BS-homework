import { Page } from "@playwright/test";

export class SummaryPage {
  constructor(public readonly page: Page) {}

  public locators = {
    getCompleteHeader: () => this.page.getByTestId("complete-header"),
  };
}
