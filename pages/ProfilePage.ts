import { Page, Locator, expect } from '@playwright/test';

export class ProfilePage {
  page: Page;
  name: Locator;
  surname: Locator;
  email: Locator;

  constructor(page: Page) {
    this.page = page;
    this.name = page.locator('p:has(.label:text-is("Name:"))');
    this.surname = page.locator('p:has(.label:text-is("Surname:"))');
    this.email = page.locator('p:has(.label:text-is("Email:"))');
  }

  async navigate() {
    await this.page.goto('/profile');
    await this.page.waitForLoadState('networkidle');
  }

  async getName(): Promise<string> {
  const text = await this.name.textContent();
  return text?.split(': ')[1]?.trim() ?? '';
  }

  async getSurname(): Promise<string> {
    const text = await this.surname.textContent();
    return text?.split(': ')[1]?.trim() ?? '';
  }

  async getEmail(): Promise<string> {
    const text = await this.email.textContent();
    return text?.split(': ')[1]?.trim() ?? '';
  }
}