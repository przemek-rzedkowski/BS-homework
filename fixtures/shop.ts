import { Page } from "@playwright/test";

export class ShopPage {
  constructor(public readonly page: Page) {}

  public locators = {
    getInventoryItem: () => this.page.getByTestId("inventory-item"),
    getAddOnesieToCartButton: () =>
      this.page.getByTestId("add-to-cart-sauce-labs-onesie"),
    getRemoveOnesieFromCartButton: () =>
      this.page.getByTestId("remove-sauce-labs-onesie"),
    getProceedToCartButton: () => this.page.getByTestId("shopping-cart-link"),
    getOnesiePrice: () =>
      this.page.locator(
        'xpath = //div[text()="Sauce Labs Onesie"]/ancestor::div[@data-test="inventory-item-description"]//div[@data-test="inventory-item-price"]',
      ),
  };
}
