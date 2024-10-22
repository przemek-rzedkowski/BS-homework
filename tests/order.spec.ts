import { expect } from "@playwright/test";
import { test } from "@helpers/base";
import commonJsonData from "@data/common.json";
import cartJsonData from "@data/cart.json";

let itemPrice: string;
let itemName: string;

test.describe("Cart", () => {
  test.beforeEach(async ({ page, header, loginPage, shopPage }) => {
    await page.goto(commonJsonData.baseUrl);
    // unable to log in beforehand using API due to lack of API (all-frontend app)
    // due to this I've decided to soft-assert steps needed for an (A)range phase (just to be sure)
    await expect.soft(loginPage.locators.getUsernameInput()).toBeVisible();
    await loginPage.locators.getUsernameInput().fill(commonJsonData.login);
    await loginPage.locators.getPasswordInput().fill(commonJsonData.password);
    await loginPage.locators.getSubmitButton().click();
    expect
      .soft(await shopPage.locators.getInventoryItem().count())
      .toBeGreaterThan(0);

    itemPrice = await shopPage.locators.getFirstItemPrice().innerText();
    itemName = await shopPage.locators.getFirstItemName().innerText();

    await shopPage.locators.getFirstAddToCartButton().click();
    expect
      .soft(header.locators.getShoppingCartBadge())
      .toContainText(cartJsonData.cartCounter);
    expect
      .soft(shopPage.locators.getRemoveFirstItemFromCartButton())
      .toBeVisible();
  });

  test("should place an order", async ({
    header,
    shopPage,
    cartPage,
    addressPage,
    checkoutPage,
    summaryPage,
  }) => {
    await shopPage.locators.getProceedToCartButton().click();
    expect
      .soft(cartPage.locators.getItemQuantity())
      .toContainText(cartJsonData.cartCounter);
    expect.soft(cartPage.locators.getItemTitle()).toContainText(itemName);
    expect.soft(cartPage.locators.getItemPrice()).toContainText(itemPrice);
    await cartPage.locators.getCheckoutButton().click();

    // in here I could've also check whether form inputs' errors are shown properly
    // however I think e2e suite is not a place to check things like error handling (shift left)
    await addressPage.locators.getFirstnameInput().fill(cartJsonData.firstName);
    await addressPage.locators.getLastnameInput().fill(cartJsonData.lastName);
    await addressPage.locators
      .getPostalcodeInput()
      .fill(cartJsonData.postalCode);
    await addressPage.locators.getSubmitButton().click();

    expect
      .soft(checkoutPage.locators.getItemQuantity())
      .toContainText(cartJsonData.cartCounter);
    expect.soft(checkoutPage.locators.getItemTitle()).toContainText(itemName);
    expect.soft(checkoutPage.locators.getItemPrice()).toContainText(itemPrice);
    const taxLabel = await checkoutPage.locators.getTaxLabel().innerText();
    const tax = +taxLabel.substring(taxLabel.indexOf("$") + 1);
    const totalLabel = await checkoutPage.locators
      .getTotalPriceLabel()
      .innerText();
    const total = +totalLabel.substring(totalLabel.indexOf("$") + 1);
    expect(total).toEqual(+itemPrice.substring(1) + tax);
    await checkoutPage.locators.getSubmitButton().click();
    expect(summaryPage.locators.getCompleteHeader()).toBeVisible();
    expect(header.locators.getShoppingCartBadge()).toBeHidden();
  });

  test("should be able to remove product from a cart on the list page", async ({
    header,
    shopPage,
  }) => {
    await shopPage.locators.getRemoveFirstItemFromCartButton().click();
    expect(header.locators.getShoppingCartBadge()).toBeHidden();
    expect(shopPage.locators.getFirstAddToCartButton()).toBeVisible();
  });

  test("should be able to remove product from the cart on the cart page", async ({
    shopPage,
    cartPage,
    checkoutPage,
  }) => {
    await shopPage.locators.getProceedToCartButton().click();
    expect
      .soft(cartPage.locators.getItemQuantity())
      .toContainText(cartJsonData.cartCounter);
    expect.soft(cartPage.locators.getItemTitle()).toContainText(itemName);
    expect.soft(cartPage.locators.getItemPrice()).toContainText(itemPrice);
    await cartPage.locators.getRemoveFirstItemFromCartButton().click();
    expect(checkoutPage.locators.getItemQuantity()).toBeHidden();
    expect(checkoutPage.locators.getItemTitle()).toBeHidden();
    expect(checkoutPage.locators.getItemPrice()).toBeHidden();
    // submit button should also be inactive in case of the empty cart imho, but this app doesn't work like this
  });
});
