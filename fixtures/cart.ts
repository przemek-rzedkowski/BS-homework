import { Page } from "@playwright/test";

export class CartPage {
  constructor(public readonly page: Page) {}

  public locators = {
    getItemQuantity: () => this.page.getByTestId("item-quantity"),
    getItemTitle: () => this.page.getByTestId("item-2-title-link"),
    getItemPrice: () => this.page.getByTestId("inventory-item-price"),
    getCheckoutButton: () => this.page.getByTestId("checkout"),
    // despite data-test being the same as on the shopping page I've devided to add
    // another selector to decrease complexity
    getRemoveOnesieFromCartButton: () =>
      this.page.getByTestId("remove-sauce-labs-onesie"),
  };
}
