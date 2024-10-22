import { Page } from "@playwright/test";

export class Header {
  constructor(public readonly page: Page) {}

  public locators = {
    getShoppingCartBadge: () => this.page.getByTestId("shopping-cart-badge"),
  };
}
