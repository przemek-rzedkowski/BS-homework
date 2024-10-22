import { Page } from "@playwright/test";

export class ShopPage {
  constructor(public readonly page: Page) {}

  public locators = {
    getInventoryItem: () => this.page.getByTestId("inventory-item"),
    getProceedToCartButton: () => this.page.getByTestId("shopping-cart-link"),
    // I've decided to pick first item on the page in case any item will be removed in the next iteration of the page
    // I am aware that this site is likely not going to change, but I think it would be poor practice to rely on a specific shopping item
    // Additionally data-test attributes are so specific on this page that I was forced to use Xpath
    getFirstAddToCartButton: () =>
      this.page
        .locator("xpath = //button[starts-with(@id, 'add-to-cart-sauce-labs')]")
        .first(),
    getRemoveFirstItemFromCartButton: () =>
      this.page
        .locator("xpath = //button[starts-with(@id, 'remove-sauce-labs')]")
        .first(),
    getFirstItemPrice: () =>
      this.page.getByTestId("inventory-item-price").first(),
    getFirstItemName: () =>
      this.page.getByTestId("inventory-item-name").first(),
  };
}
