import { test, expect } from '@playwright/test';
import { RegisterPage } from '../../pages/RegisterPage';
import { generateUser} from '../../utils/data-generator';

let registerPage: RegisterPage;

test.beforeEach(async ({ page }) => {
    registerPage = new RegisterPage(page);
    await registerPage.navigate();
});

test('TC:01 Регистрация с валидными данными', async ({page}) => {
    const user = generateUser();

    await registerPage.fillForms(user);
    await registerPage.submit();
    await expect (page).toHaveURL('/login');
});

test('TC:02 Регистрация с уже занятым email', async ({page}) => {
    const user = generateUser();
    
    await registerPage.fillForms(user);
    await registerPage.submit();
    await expect (page).toHaveURL('/login');
    await registerPage.navigate();
    const userWithSameEmail = generateUser();
    userWithSameEmail.email = user.email;
    await registerPage.fillForms(userWithSameEmail);
    await registerPage.submit();
    await expect(registerPage.page.getByText('User with this email already exists')).toBeVisible();
});

test('TC:03 Регистрация с невалидным email', async () => {
    const user = generateUser();
    user.email = 'не-email';

    await registerPage.fillForms(user);
    await registerPage.submit();
    const message = await registerPage.emailInput.evaluate(
        (el) => (el as HTMLInputElement).validationMessage
    );
    expect(message).toBeTruthy();
    // expect(message).toBe('Адрес электронной почты должен содержать символ "@". В адресе "не-email" отсутствует символ "@".');
});

test('TC:04 Регистрация с пустым именем', async () => {
    const user = generateUser();
    user.name = '';

    await registerPage.fillForms(user);
    await registerPage.submit();
    const message = await registerPage.nameInput.evaluate(
        (el) => (el as HTMLInputElement).validationMessage
    );
    expect(message).toBeTruthy();
    // expect(message).toBe('Заполните это поле.');
});

test('TC:05 Регистрация с пустой фамилией', async () => {
    const user = generateUser();
    user.surname = '';

    await registerPage.fillForms(user);
    await registerPage.submit();
    const message = await registerPage.surnameInput.evaluate(
        (el) => (el as HTMLInputElement).validationMessage
    );
    expect(message).toBeTruthy();
    // expect(message).toBe('Заполните это поле.');
});

test('TC:06 Регистрация с пустым email', async () => {
    const user = generateUser();
    user.email = '';

    await registerPage.fillForms(user);
    await registerPage.submit();
    const message = await registerPage.emailInput.evaluate(
        (el) => (el as HTMLInputElement).validationMessage
    );
    expect(message).toBeTruthy();
    // expect(message).toBe('Заполните это поле.');
});

test('TC:07 Регистрация с пустым паролем', async () => {
    const user = generateUser();
    user.password = '';

    await registerPage.fillForms(user);
    await registerPage.submit();
    const message = await registerPage.passwordInput.evaluate(
        (el) => (el as HTMLInputElement).validationMessage
    );
    expect(message).toBeTruthy();
    // expect(message).toBe('Заполните это поле.');
});
