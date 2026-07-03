import { Page, Locator, expect } from '@playwright/test';

export class RegisterPage {
  readonly page: Page;
  readonly nameInput: Locator;
  readonly surnameInput: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.nameInput = page.locator('.input[name="name"]');
    this.surnameInput = page.locator('.input[name="surname"]');
    this.emailInput = page.locator('.input[name="login"]');
    this.passwordInput = page.locator('.input[name="Type your password"]');
    this.submitButton = page.getByRole('button', { name: ' Register ' });
  }

  async navigate() {
    await this.page.goto('/register');
    await this.page.waitForLoadState('networkidle');
  }

  async fillForms(user: { name: string; surname: string; email: string; password: string}) {
    await this.nameInput.fill(user.name);
    await this.surnameInput.fill(user.surname);
    await this.emailInput.fill(user.email);
    await this.passwordInput.fill(user.password);
  }

  async submit() {
    await this.submitButton.click();
  }

  async shouldSeeError(text: string) {
    await expect(this.page.getByText(text)).toBeVisible();
  }
}