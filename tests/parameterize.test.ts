import { test } from 'app/fixtures';
import { invalidLoginData } from 'testData/invalidLoginData';
import { invalidUserData } from 'testData/invalidUserData';

test.describe('Parameterize tests', { tag: ['@params'] }, () => {
  for (const item of invalidUserData) {
    test(
      `CON-050-${item.id} Registration with invalid data: ${item.testCase}`,
      { tag: ['@CON-050'] },
      async ({ API: { userController } }) => {
        const registerUserResponse = await userController.signUpUser(item.data);

        await userController.expectResponseStatusCode(
          registerUserResponse,
          item.expectedCode,
        );
      },
    );
  }

  for (const item of invalidLoginData) {
    test(
      `CON-051-${item.id} Login with invalid data: ${item.testCase}`,
      { tag: ['@CON-051'] },
      async ({ API: { userController } }) => {
        const loginUserResponse = await userController.signInUser(
          item.credentials,
        );

        await userController.expectResponseStatusCode(
          loginUserResponse,
          item.expectedCode,
        );
      },
    );
  }
});
