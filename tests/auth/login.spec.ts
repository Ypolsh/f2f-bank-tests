import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { generateUser} from '../../utils/data-generator';
import { createUserWithApi } from '../../utils/api-helper';


let loginPage: LoginPage;
let user: any;

test.beforeEach(async ({ page, request }) => {
  loginPage = new LoginPage(page);
  user = generateUser();

  await createUserWithApi(request, {
    name: user.name,
    surname: user.surname,
    email: user.email,
    password: user.password,
  });

  await loginPage.navigate();
});

test('TC:08 Вход с правильными данными', async ({page}) => {
  await loginPage.fillForms(user.email, user.password);
  await loginPage.submit();
  await expect (page).toHaveURL('/');
});

test('TC:09 Вход с неверным паролем', async () => {
  await loginPage.fillForms(user.email, 'WrongPassword123');
  await loginPage.submit();
  await expect(loginPage.page.getByText('Login failed')).toBeVisible();
});

test('TC:10 Вход с неверным email', async () => {
  await loginPage.fillForms('notright@mail.ru', user.password);
  await loginPage.submit();
  await expect(loginPage.page.getByText('Login failed')).toBeVisible();
});

test('TC:11 Вход с пустым email', async () => {
  await loginPage.fillForms('', user.password);
  await loginPage.submit();
  const message = await loginPage.emailInput.evaluate(
        (el) => (el as HTMLInputElement).validationMessage
    );
  expect(message).toBeTruthy();
  // expect(message).toBe('Заполните это поле.');
});

test('TC:12 Вход с пустым паролем', async () => {
  await loginPage.fillForms(user.email, '');
  await loginPage.submit();
  const message = await loginPage.passwordInput.evaluate(
        (el) => (el as HTMLInputElement).validationMessage
    );
  expect(message).toBeTruthy();
  // expect(message).toBe('Заполните это поле.');
});

test('TC:13 Выход из системы', async ({ page }) => {
 
  await loginPage.fillForms(user.email, user.password);
  await loginPage.submit();
  await expect(page).toHaveURL('/');
  // Выходим
  const logoutButton = page.locator('button.app-button'); 
  await logoutButton.click();

  await expect(page).toHaveURL('/login');
});
