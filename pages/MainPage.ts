import { Page, Locator, expect } from '@playwright/test';

export class MainPage {
  page: Page;
  phoneInput: Locator;
  amountInput: Locator;
  purposeInput: Locator;
  sendButton: Locator;
  balanceText: Locator;

  constructor(page: Page) {
    this.page = page;
    this.phoneInput = page.locator('.input[name="phone"]');
    this.amountInput = page.locator('.input[name="amount"]');
    this.purposeInput = page.locator('.input[name="purpose"]');
    this.sendButton = page.getByRole('button', { name: 'Send' });
    this.balanceText = page.locator('.balance-hint');
  }

  async navigate() {
    await this.page.goto('/');
    await this.page.waitForLoadState('networkidle');
  }

  async fillTransferForm(phone: string, amount: string, purpose: string) {
    await this.phoneInput.fill(phone);
    await this.amountInput.fill(amount);
    await this.purposeInput.fill(purpose);
  }

  async submitTransfer() {
    await this.sendButton.click();
  }

  async getBalance(): Promise<number> {
  const text = await this.balanceText.textContent();
  const balance = parseFloat((text ?? '').replace('Balance: ', ''));
  return balance;
  }
}
