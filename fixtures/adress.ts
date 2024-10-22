import { Page } from "@playwright/test";

export class AddressPage {
  constructor(public readonly page: Page) {}

  public locators = {
    getFirstnameInput: () => this.page.getByTestId("firstName"),
    getLastnameInput: () => this.page.getByTestId("lastName"),
    getPostalcodeInput: () => this.page.getByTestId("postalCode"),
    getSubmitButton: () => this.page.getByTestId("continue"),
  };
}
