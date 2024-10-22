import { Page } from "@playwright/test";

export class CartPage {
  constructor(public readonly page: Page) {}

  public locators = {
    getItemQuantity: () => this.page.getByTestId("item-quantity"),
    getItemTitle: () => this.page.getByTestId("inventory-item-name"),
    getItemPrice: () => this.page.getByTestId("inventory-item-price"),
    getCheckoutButton: () => this.page.getByTestId("checkout"),
    // despite data-test being the same as on the shopping page I've devided to add
    // another selector to decrease complexity
    // Also
    // I've decided to pick first item on the page in case any item will be removed in the next iteration of the page
    // I am aware that this site is likely not going to change, but I think it would be poor practice to rely on a specific shopping item
    // Additionally data-test attributes are so specific on this page that I was forced to use Xpath
    getRemoveFirstItemFromCartButton: () =>
      this.page
        .locator("xpath = //button[starts-with(@id, 'remove-sauce-labs')]")
        .first(),
  };
}
