import { Page, Locator, expect } from '@playwright/test';

export class TransactionPage {
  page: Page;
  upButton: Locator;
  upAmountInput: Locator;
  confirmUpButton: Locator;
  transactionItem: Locator;

  constructor(page: Page) {
    this.page = page;
    this.upButton = page.getByRole('button', { name: 'Add balance' });
    this.upAmountInput = page.locator('.input[name="balance"]');
    this.confirmUpButton = page.getByRole('button', { name: 'Add',  exact: true });
    this.transactionItem = page.locator('.transactions__table tbody tr');
  }

  async navigate() {
    await this.page.goto('/transactions');
    await this.page.waitForLoadState('networkidle');
  }

  async upBalance(amount: string) {
    await this.upButton.click();
    await this.upAmountInput.fill(amount);
    await this.confirmUpButton.click();
  }

  async getTransactionCount(): Promise<number> {
    return await this.transactionItem.count();
  }
}