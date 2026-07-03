import { faker } from '@faker-js/faker';

export function generateUser() {
  return {
    name: faker.person.firstName(),
    surname: faker.person.lastName(),
    email: faker.internet.email(),
    password: 'Test123!',
  };
}

export function generatePhone() {
  return `+7${faker.string.numeric(10)}`;
}

export function generateAmount(min = 1, max = 10000) {
  return faker.number.int({ min, max });
}

