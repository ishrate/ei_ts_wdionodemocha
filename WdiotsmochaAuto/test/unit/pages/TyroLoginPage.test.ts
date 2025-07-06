const { test, expect } = require('@jest/globals');

test('successful login', async () => {
    const username = 'testUser';
    const password = 'testPassword';
    const result = await login(username, password);
    expect(result).toBe(true);
});

test('failed login with incorrect password', async () => {
    const username = 'testUser';
    const password = 'wrongPassword';
    const result = await login(username, password);
    expect(result).toBe(false);
});

test('failed login with empty username', async () => {
    const username = '';
    const password = 'testPassword';
    const result = await login(username, password);
    expect(result).toBe(false);
});

test('failed login with empty password', async () => {
    const username = 'testUser';
    const password = '';
    const result = await login(username, password);
    expect(result).toBe(false);
});