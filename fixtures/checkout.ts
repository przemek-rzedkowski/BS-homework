import { Page } from "@playwright/test";

export class CheckoutPage {
  constructor(public readonly page: Page) {}

  public locators = {
    getItemQuantity: () => this.page.getByTestId("item-quantity"),
    getItemTitle: () => this.page.getByTestId("item-2-title-link"),
    getItemPrice: () => this.page.getByTestId("inventory-item-price"),
    getTaxLabel: () => this.page.getByTestId("tax-label"),
    getTotalPriceLabel: () => this.page.getByTestId("total-label"),
    getSubmitButton: () => this.page.getByTestId("finish"),
  };
}
