import { test } from 'app/fixtures';
import { createRandomUser } from 'helpers/createRandomUser';

test.describe(
  'User sign up',
  {
    tag: ['@signup'],
  },
  () => {
    test(
      'CON-001 Sign up a new user',
      {
        tag: ['@CON-001', '@signup'],
      },
      async ({ API: { userController } }) => {
        const { firstName, email, password } = await createRandomUser();

        const signUpUserResponse = await userController.signUpUser({
          username: firstName,
          email: email,
          password: password,
        });

        await userController.expectResponseStatusCode(signUpUserResponse, 200);
        await userController.expectResponseHaveProperty(
          (await signUpUserResponse.json()).user,
          'token',
        );
      },
    );

    test(
      'CON-002 Sign up with existing user email',
      {
        tag: ['@CON-002', '@signup'],
      },
      async ({
        registerNewUser: {
          API: { userController },
          user,
        },
      }) => {
        const { firstName, email, password } = user;
        const signUpUserResponse = await userController.signUpUser({
          username: `new${firstName}`,
          email: email,
          password: password,
        });

        await userController.expectResponseStatusCode(signUpUserResponse, 422);
      },
    );

    test(
      'CON-003 Sign up with existing user name',
      {
        tag: ['@CON-003', '@signup'],
      },
      async ({
        registerNewUser: {
          API: { userController },
          user,
        },
      }) => {
        const { firstName, email, password } = user;
        const signUpUserResponse = await userController.signUpUser({
          username: firstName,
          email: `new${email}`,
          password: password,
        });

        await userController.expectResponseStatusCode(signUpUserResponse, 422);
      },
    );

    test(
      'CON-004 Sign up with invalid email format',
      {
        tag: ['@CON-004', '@signup'],
      },
      async ({
        registerNewUser: {
          API: { userController },
          user,
        },
      }) => {
        const { firstName, password } = user;
        const signUpUserResponse = await userController.signUpUser({
          username: firstName,
          email: 'new.user.email',
          password: password,
        });

        await userController.expectResponseStatusCode(signUpUserResponse, 422);
      },
    );

    test(
      'CON-005 Sign up with empty required fields',
      {
        tag: ['@CON-005', '@signup'],
      },
      async ({
        registerNewUser: {
          API: { userController },
        },
      }) => {
        const signUpUserResponse = await userController.signUpUser({
          username: '',
          email: '',
          password: '',
        });

        await userController.expectResponseStatusCode(signUpUserResponse, 422);
      },
    );
  },
);

test.describe(
  'User sign in',
  {
    tag: ['@signin'],
  },
  () => {
    test(
      'CON-006 Sign in with existing user',
      {
        tag: ['@CON-006'],
      },
      async ({
        registerNewUser: {
          API: { userController },
          user,
        },
      }) => {
        const { email, password } = user;

        const signInUserResponse = await userController.signInUser({
          email,
          password,
        });

        await userController.expectResponseStatusCode(signInUserResponse, 200);
        await userController.expectResponseHaveProperty(
          (await signInUserResponse.json()).user,
          'token',
        );
      },
    );

    test(
      'CON-007 Sign in with wrong password',
      {
        tag: ['@CON-007'],
      },
      async ({
        registerNewUser: {
          API: { userController },
          user,
        },
      }) => {
        const { email } = user;
        const password = 'wrongPassword123';

        const signInUserResponse = await userController.signInUser({
          email,
          password,
        });

        await userController.expectResponseStatusCode(signInUserResponse, 422);
      },
    );

    test(
      'CON-008 Sign in with not existing email',
      {
        tag: ['@CON-008'],
      },
      async ({
        registerNewUser: {
          API: { userController },
          user,
        },
      }) => {
        const { password } = user;
        const email = 'wrong.email.123';

        const signInUserResponse = await userController.signInUser({
          email,
          password,
        });

        await userController.expectResponseStatusCode(signInUserResponse, 422);
      },
    );

    test(
      'CON-009 Sign in with empty required fields',
      {
        tag: ['@CON-009'],
      },
      async ({
        registerNewUser: {
          API: { userController },
        },
      }) => {
        const password = '';
        const email = '';

        const signInUserResponse = await userController.signInUser({
          email,
          password,
        });

        await userController.expectResponseStatusCode(signInUserResponse, 422);
      },
    );
  },
);

test.describe(
  'Edit user profile',
  {
    tag: ['@editProfile'],
  },
  () => {
    test(
      'CON-010 Update user profile',
      {
        tag: ['@CON-010'],
      },
      async ({
        registerNewUser: {
          API: { userController },
          user,
          token,
        },
      }) => {
        const { email, password } = user;
        const { bio } = await createRandomUser();

        const editUserProfileResponse = await userController.editUser(
          { email, password, bio },
          token,
        );

        await userController.expectResponseStatusCode(
          editUserProfileResponse,
          200,
        );
        await userController.expectResponseHaveProperty(
          (await editUserProfileResponse.json()).user,
          'token',
        );
        await userController.expectResponseHaveProperty(
          (await editUserProfileResponse.json()).user,
          'bio',
        );
      },
    );

    test(
      'CON-011 Update user profile without token',
      {
        tag: ['@CON-011'],
      },
      async ({
        registerNewUser: {
          API: { userController },
          user,
        },
      }) => {
        const { email, password } = user;
        const { bio } = await createRandomUser();
        const customToken = '';

        const editUserProfileResponse = await userController.editUser(
          { email, password, bio },
          customToken,
        );

        await userController.expectResponseStatusCode(
          editUserProfileResponse,
          401,
        );
      },
    );

    test(
      'CON-012 Get user profile',
      {
        tag: ['@CON-012'],
      },
      async ({
        editUserProfile: {
          API: { userController },
          token,
        },
      }) => {
        const getUserProfileResponse = await userController.getUser(token);

        await userController.expectResponseStatusCode(
          getUserProfileResponse,
          200,
        );
        await userController.expectResponseHaveProperty(
          (await getUserProfileResponse.json()).user,
          'token',
        );
        await userController.expectResponseHaveProperty(
          (await getUserProfileResponse.json()).user,
          'username',
        );
        await userController.expectResponseHaveProperty(
          (await getUserProfileResponse.json()).user,
          'email',
        );
        await userController.expectResponseHaveProperty(
          (await getUserProfileResponse.json()).user,
          'bio',
        );
      },
    );
  },
);
