import { APIRequestContext } from '@playwright/test';

export async function createUserWithApi(request: APIRequestContext, user: {
  name: string;
  surname: string;
  email: string;
  password: string;
}) {
  const response = await request.post('/api/auth/register', {
    data: {
      name: user.name,
      surname: user.surname,
      email: user.email,
      password: user.password,
      role: 'user',
    },
  });

  if (!response.ok()) {
    const body = await response.text();
    throw new Error(`Не удалось создать пользователя: ${response.status()} ${body}`);
  }

  return await response.json();
}

export async function upBalanceWithApi(request: APIRequestContext, amount: number, cookieHeader: string) {
  const response = await request.post('/api/users/balance/add', {
    data: {
      amount: amount,
    },
    headers: {
      'Cookie': cookieHeader,
    },
  });

  if (!response.ok()) {
    const body = await response.text();
    throw new Error(`Не удалось пополнить баланс: ${response.status()} ${body}`);
  }

  return await response.json();
}