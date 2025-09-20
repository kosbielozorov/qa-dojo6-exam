// 1. Create a new user
// 2. Login as new user
// 3. Edit user profile

import test from '@playwright/test';
import { BaseController } from '../base.controller';

// https://conduit-api.learnwebdriverio.com/api/users - POST - create user

// https://conduit-api.learnwebdriverio.com/api/user - POST - login user

export class UserController extends BaseController {
  /**
   * Signs up a new user by making a POST request to the users API endpoint.
   *
   * @param user - The user object containing user registration data
   * @returns Promise that resolves to the API response from the user registration request
   */
  async signUpUser(user) {
    let response;

    await test.step('Sign up new user', async () => {
      response = await this.postReq('/api/users', { user });
    });

    return response;
  }

  /**
   * Signs in a user by sending a POST request to the login endpoint.
   *
   * @param user - The user object containing login credentials
   * @returns Promise that resolves to the response from the login API
   *
   * @example
   * ```typescript
   * const response = await userController.signInUser({
   *   email: "user@example.com",
   *   password: "password123"
   * });
   * ```
   */
  async signInUser(user) {
    let response;

    await test.step('Sign in user', async () => {
      response = await this.postReq(
        '/api/users/login',
        {
          user,
        },
        // { headers: { Authorization: `Bearer ${token}` } },
      );
    });

    return response;
  }

  /**
   * Edits a user profile by sending a PUT request to the user API endpoint.
   *
   * @param user - The user object containing the updated user information
   * @param token - The authentication token used for authorization
   * @returns A promise that resolves to the response from the API request
   *
   * @example
   * ```typescript
   * const response = await editUser(updatedUserData, authToken);
   * ```
   */
  async editUser(user, token: string) {
    let response;

    await test.step('Edit user profile', async () => {
      response = await this.putReq(
        '/api/user',
        {
          user,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );
    });

    return response;
  }

  /**
   * Retrieves the user profile information using the provided authentication token.
   *
   * @param token - The Bearer authentication token used to authorize the request
   * @returns Promise that resolves to the API response containing user profile data
   *
   * @example
   * ```typescript
   * const userResponse = await userController.getUser('your-auth-token');
   * ```
   */
  async getUser(token: string) {
    let response;

    await test.step('Get user profile', async () => {
      response = await this.getReq('/api/user', {
        headers: { Authorization: `Bearer ${token}` },
      });
    });

    return response;
  }
}
