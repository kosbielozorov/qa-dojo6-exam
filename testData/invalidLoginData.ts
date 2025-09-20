export const invalidLoginData = [
  {
    id: 1,
    testCase: 'Wrong password',
    credentials: { email: 'valid@example.com', password: 'wrongpassword' },
    expectedCode: 422,
  },
  {
    id: 2,
    testCase: 'Non-existent email',
    credentials: { email: 'notexist@example.com', password: 'password123' },
    expectedCode: 422,
  },
  {
    id: 3,
    testCase: 'Empty email',
    credentials: { email: '', password: 'password123' },
    expectedCode: 422,
  },
  {
    id: 4,
    testCase: 'Empty password',
    credentials: { email: 'test@example.com', password: '' },
    expectedCode: 422,
  },
  {
    id: 5,
    testCase: 'Invalid email format',
    credentials: { email: 'invalid-email', password: 'password123' },
    expectedCode: 422,
  },
];
