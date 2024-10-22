import { test as base } from "@playwright/test";
import { AddressPage } from "fixtures/adress";
import { CartPage } from "fixtures/cart";
import { CheckoutPage } from "fixtures/checkout";
import { Header } from "fixtures/header";
import { LoginPage } from "fixtures/login";
import { ShopPage } from "fixtures/shop";
import { SummaryPage } from "fixtures/summary";

export const test = base.extend<{
  header: Header;
  loginPage: LoginPage;
  shopPage: ShopPage;
  cartPage: CartPage;
  addressPage: AddressPage;
  checkoutPage: CheckoutPage;
  summaryPage: SummaryPage;
}>({
  header: async ({ page }, use) => await use(new Header(page)),
  loginPage: async ({ page }, use) => await use(new LoginPage(page)),
  shopPage: async ({ page }, use) => await use(new ShopPage(page)),
  cartPage: async ({ page }, use) => await use(new CartPage(page)),
  addressPage: async ({ page }, use) => await use(new AddressPage(page)),
  checkoutPage: async ({ page }, use) => await use(new CheckoutPage(page)),
  summaryPage: async ({ page }, use) => await use(new SummaryPage(page)),
});
