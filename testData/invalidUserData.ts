export const invalidUserData = [
  {
    id: 1,
    testCase: 'Empty username',
    data: { username: '', email: 'test@example.com', password: 'password123' },
    expectedCode: 422,
  },
  {
    id: 2,
    testCase: 'Empty email',
    data: { username: 'testuser', email: '', password: 'password123' },
    expectedCode: 422,
  },
  {
    id: 3,
    testCase: 'Invalid email format',
    data: {
      username: 'testuser',
      email: 'invalid-email',
      password: 'password123',
    },
    expectedCode: 422,
  },
  {
    id: 4,
    testCase: 'Short password',
    data: {
      username: 'testuser',
      email: 'test123@example.com',
      password: '123',
    },
    expectedCode: 422,
  },
  {
    id: 5,
    testCase: 'Username too short',
    data: {
      username: 'ab',
      email: 'test321@example.com',
      password: 'password123',
    },
    expectedCode: 422,
  },
  {
    id: 6,
    testCase: 'Special chars in username',
    data: {
      username: 'test@user!',
      email: '123test@example.com',
      password: 'password123',
    },
    expectedCode: 422,
  },
];
