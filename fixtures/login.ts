import { Page } from "@playwright/test";

export class LoginPage {
  constructor(public readonly page: Page) {}

  public locators = {
    getUsernameInput: () => this.page.getByTestId("username"),
    getPasswordInput: () => this.page.getByTestId("password"),
    getSubmitButton: () => this.page.getByTestId("login-button"),
  };
}
