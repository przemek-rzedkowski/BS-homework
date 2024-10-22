import { expect } from "@playwright/test";
import { test } from "@helpers/base";

const commonJsonData = require("../test-data/common.json");
const cartJsonData = require("../test-data/cart.json");
let itemPrice: string;

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

    itemPrice = await shopPage.locators.getOnesiePrice().innerText();

    await shopPage.locators.getAddOnesieToCartButton().click();
    expect
      .soft(header.locators.getShoppingCartBadge())
      .toContainText(cartJsonData.cartCounter);
    expect
      .soft(shopPage.locators.getRemoveOnesieFromCartButton())
      .toBeVisible();
  });

  test("should place an order", async ({
    page,
    header,
    shopPage,
    cartPage,
    addressPage,
    checkoutPage,
  }) => {
    await shopPage.locators.getProceedToCartButton().click();
    expect
      .soft(cartPage.locators.getItemQuantity())
      .toContainText(cartJsonData.cartCounter);
    expect
      .soft(cartPage.locators.getItemTitle())
      .toContainText(cartJsonData.itemTitle);
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
    expect
      .soft(checkoutPage.locators.getItemTitle())
      .toContainText(cartJsonData.itemTitle);
    expect.soft(checkoutPage.locators.getItemPrice()).toContainText(itemPrice);
    const taxLabel = await checkoutPage.locators.getTaxLabel().innerText();
    const tax = +taxLabel.substring(taxLabel.indexOf("$") + 1);
    const totalLabel = await checkoutPage.locators
      .getTotalPriceLabel()
      .innerText();
    const total = +totalLabel.substring(totalLabel.indexOf("$") + 1);
    expect(total).toEqual(+itemPrice.substring(1) + tax);
    await checkoutPage.locators.getSubmitButton().click();
    expect((await page.$(`text=${cartJsonData.summaryText}`)).isVisible());
    expect(header.locators.getShoppingCartBadge()).toBeHidden();
  });

  test("should be able to remove product from a cart on the list page", async ({
    header,
    shopPage,
  }) => {
    await shopPage.locators.getRemoveOnesieFromCartButton().click();
    expect(header.locators.getShoppingCartBadge()).toBeHidden();
    expect(shopPage.locators.getAddOnesieToCartButton()).toBeVisible();
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
    expect
      .soft(cartPage.locators.getItemTitle())
      .toContainText(cartJsonData.itemTitle);
    expect.soft(cartPage.locators.getItemPrice()).toContainText(itemPrice);
    await cartPage.locators.getRemoveOnesieFromCartButton().click();
    expect(checkoutPage.locators.getItemQuantity()).toBeHidden();
    expect(checkoutPage.locators.getItemTitle()).toBeHidden();
    expect(checkoutPage.locators.getItemPrice()).toBeHidden();
    // submit button should also be inactive in case of the empty cart imho, but this app doesn't work like this
  });
});
