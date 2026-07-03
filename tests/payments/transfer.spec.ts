import { test, expect } from '@playwright/test';
import { generateUser, generatePhone, generateAmount } from '../../utils/data-generator';
import { createUserWithApi, upBalanceWithApi } from '../../utils/api-helper';
import { LoginPage } from '../../pages/LoginPage';
import { MainPage } from '../../pages/MainPage';
import { TransactionPage } from '../../pages/TransactionPage';


let sender: ReturnType<typeof generateUser>;
let receiverPhone: string;
let mainPage: MainPage;
let initialBalance: number;

test.beforeEach(async ({ page, request }) => {
  sender = generateUser();
  receiverPhone = generatePhone();
  mainPage = new MainPage(page);
  const loginPage: LoginPage = new LoginPage(page);

  await createUserWithApi(request, {
    name: sender.name,
    surname: sender.surname,
    email: sender.email,
    password: sender.password,
  });
  await loginPage.navigate();
  await loginPage.fillForms(sender.email, sender.password);
  await loginPage.submit();
  await expect (page).toHaveURL('/');
  const cookies = await mainPage.page.context().cookies();
  const cookieHeader = cookies.map(c => `${c.name}=${c.value}`).join('; ');
  await upBalanceWithApi(request, 1000, cookieHeader);
  await page.reload(); // Добавлено для подгрузки баланса, иначе не успевает подхватить

});

test('TC:14 Успешный перевод средств (изменился баланс)', async () => {
  initialBalance = await mainPage.getBalance();
  const amount = String(generateAmount(100, 500));

  await mainPage.fillTransferForm(receiverPhone, amount, 'изменился баланс');
  await mainPage.submitTransfer();
  await expect(mainPage.page.getByText('Transfer completed successfully')).toBeVisible();
  const newBalance = await mainPage.getBalance();
  expect(initialBalance - newBalance).toBe(Number(amount));
});

test('TC:15 Успешный перевод средств (изменилась история транзакций)', async ({ page }) => {
  const amount = String(generateAmount(100, 500));

  await mainPage.fillTransferForm(receiverPhone, amount, 'изменилась история транзакций');
  await mainPage.submitTransfer();
  const transactionPage = new TransactionPage(page);
  await transactionPage.navigate();
  expect(await transactionPage.getTransactionCount()).toBe(2);
});

test('TC:16 Перевод с недостаточным балансом', async () => {
  await mainPage.fillTransferForm(receiverPhone, '999999999', 'Слишком много');
  await mainPage.submitTransfer();
  await expect(mainPage.page.getByText('Transfer failed. Check your balance.')).toBeVisible();
});

test('TC:17 Перевод с невалидным номером', async () => {
  const amount = String(generateAmount(100, 500));
  await mainPage.fillTransferForm('InvalidNumber', amount, 'Перевод с невалидным номером');
  await mainPage.submitTransfer();
  await expect(mainPage.page.getByText('Must start with + and country code.')).toBeVisible();
});

test('TC:18 Перевод отрицательной суммы', async () => {
  const amount = String(generateAmount(-500, -100));
  await mainPage.fillTransferForm(receiverPhone, amount, 'Перевод отрицательной суммы');
  await mainPage.submitTransfer();
  await expect(mainPage.page.getByText('Amount must be greater than zero')).toBeVisible();
});

test('TC:19 Перевод с пустым телефоном', async () => {
  await mainPage.fillTransferForm('', '100', 'Пустой телефон');
  await mainPage.submitTransfer();
  await expect(mainPage.page.getByText('Phone number is required')).toBeVisible();
});

test('TC:20 Перевод с пустой суммой', async () => {
  await mainPage.fillTransferForm(receiverPhone, '', 'Пустая сумма');
  await mainPage.submitTransfer();
  const message = await mainPage.amountInput.evaluate(
          (el) => (el as HTMLInputElement).validationMessage
      );
  expect(message).toBeTruthy();  
  // expect(message).toBe('Заполните это поле.');
});

test('TC:21 Перевод с пустым назначением Payment purpose', async () => {
  await mainPage.fillTransferForm(receiverPhone, '100', '');
  await mainPage.submitTransfer();
  const message = await mainPage.purposeInput.evaluate(
        (el) => (el as HTMLInputElement).validationMessage
    );
  expect(message).toBeTruthy();  
  // expect(message).toBe('Заполните это поле.');
});
