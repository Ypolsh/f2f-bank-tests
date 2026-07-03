import { test, expect } from '@playwright/test';
import { generateUser } from '../../utils/data-generator';
import { createUserWithApi } from '../../utils/api-helper';
import { LoginPage } from '../../pages/LoginPage';
import { ProfilePage } from '../../pages/ProfilePage';

let user: ReturnType<typeof generateUser>;
let profilePage: ProfilePage;

test.beforeEach(async ({ page, request }) => {
  user = generateUser();
  profilePage = new ProfilePage(page);
  const loginPage = new LoginPage(page);

  await createUserWithApi(request, {
    name: user.name,
    surname: user.surname,
    email: user.email,
    password: user.password,
  });

  await loginPage.navigate()
  await loginPage.fillForms(user.email, user.password);
  await loginPage.submit();
});

test('TC:22 Данные в профиле совпадают с переданными при регистрации', async () => {
  await expect(profilePage.page).toHaveURL('/')
  await profilePage.navigate();
  expect(await profilePage.getName()).toBe(user.name)
  expect(await profilePage.getName()).toBe(user.name)
  expect(await profilePage.getName()).toBe(user.name)
});