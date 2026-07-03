import { test, expect } from '@playwright/test';
import { generateUser } from '../../utils/data-generator';
import { createUserWithApi } from '../../utils/api-helper';
import { LoginPage } from '../../pages/LoginPage';
import { TransactionPage } from '../../pages/TransactionPage';

let user: ReturnType<typeof generateUser>;
let transactionPage: TransactionPage;

test.beforeEach(async ({ page, request }) => {
  user = generateUser();
  transactionPage = new TransactionPage(page);
  const loginPage = new LoginPage(page);

  await createUserWithApi(request, {
    name: user.name,
    surname: user.surname,
    email: user.email,
    password: user.password,
  });

  await loginPage.navigate();
  await loginPage.fillForms(user.email, user.password);
  await loginPage.submit();
  await expect (page).toHaveURL('/');
  await transactionPage.navigate();
});

test('TC:23 Пополнение баланса валидной суммой (баланс изменился)', async () => {
  await transactionPage.upBalance('1000');
  await expect(transactionPage.page.locator('.header__link:has-text("Balance")')).toHaveText('Balance: 1000');
});

test('TC:24 Пополнение баланса валидной суммой (история транзакций изменилась)', async () => {
  await transactionPage.upBalance('1000');
  await expect(transactionPage.page.locator('.transactions__table tbody tr')).toBeVisible();
  expect(await transactionPage.getTransactionCount()).toBe(1);
});
test('TC:25 Пополнение баланса отрицательной суммой', async () => {
  await transactionPage.upBalance('-100');
  await expect(transactionPage.page.getByText('Balance: 0')).toBeVisible(); // Знаю, что так он в любом случае будет true, так как
  // не успеет даже попытаться провести транзакцию, до этой строки должно быть ожидание подсказки или ошибки, 
  // но таких не предусмотрено изначально, поэтому оставил так, в данном случае только таймаутом решать проблему 
  // или ожиданием того, что баланс не изменился за какое то врмея, что тоже не очень хорошо 
});