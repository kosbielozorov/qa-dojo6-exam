import { APIRequestContext, test as base } from '@playwright/test';

import { createRandomArticle } from 'helpers/createRandomArticle';
import { createRandomComment } from 'helpers/createRandomComment';
import { createRandomUser } from 'helpers/createRandomUser';
import AppApi from '../api';

type Fixtures = {
  request: APIRequestContext;
  API: AppApi;
  token: string;
  registerNewUser: {
    API: AppApi;
    user: { firstName: string; email: string; password: string };
    token: string;
  };
  editUserProfile: {
    API: AppApi;
    editedUser: {
      firstName: string;
      email: string;
      password: string;
      bio: string;
    };
    token: string;
  };
  userCreateArticle: {
    API: AppApi;
    token: string;
    createdArticle: {
      article: {
        slug: string;
        title: string;
        description: string;
        body: string;
        tagList: string[];
        createdAt: string;
        updatedAt: string;
        favorited: boolean;
        favoritesCount: number;
        author: {
          username: string;
          image: string;
          following: boolean;
        };
      };
    };
  };
  userCreateArticleWithComments: {
    API: AppApi;
    token: string;
    createdArticle: {
      article: {
        slug: string;
        title: string;
        description: string;
        body: string;
        tagList: string[];
        createdAt: string;
        updatedAt: string;
        favorited: boolean;
        favoritesCount: number;
        author: {
          username: string;
          image: string;
          following: boolean;
        };
      };
    };
  };
};

export const { expect, describe } = base;

export const test = base.extend<Fixtures>({
  API: async ({ request }, use) => {
    const API = new AppApi(request);
    await use(API);
  },
  registerNewUser: async ({ API, API: { userController } }, use) => {
    const { firstName, email, password } = await createRandomUser();

    const createUserResponse = await userController.signUpUser({
      username: firstName,
      email: email,
      password: password,
    });

    await userController.expectResponseStatusCode(createUserResponse, 200);

    const token = (await createUserResponse.json()).user.token;
    const user = { firstName, email, password };

    await use({ API, user, token });
  },
  editUserProfile: async ({ registerNewUser }, use) => {
    const { API, user, token } = registerNewUser;
    const { firstName, email, password } = user;
    const { bio } = await createRandomUser();

    const editUserResponse = await API.userController.editUser(
      {
        username: firstName,
        email: email,
        password: password,
        bio: bio,
      },
      token,
    );

    await API.userController.expectResponseStatusCode(editUserResponse, 200);

    const editedUser = { firstName, email, password, bio };

    await use({ API, editedUser, token });
  },
  userCreateArticle: async ({ registerNewUser }, use) => {
    const { API, token } = registerNewUser;
    const { title, description, body, tagList } = await createRandomArticle();
    let createArticleResponse;
    let createdArticle;

    try {
      createArticleResponse = await API.articleController.createArticle(
        { title, description, body, tagList },
        token,
      );

      await API.articleController.expectResponseStatusCode(
        createArticleResponse,
        200,
      );
      createdArticle = await createArticleResponse.json();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(`Error creating article: ${error}`);
    }

    await use({ API, token, createdArticle });
  },
  userCreateArticleWithComments: async ({ userCreateArticle }, use) => {
    const { API, token, createdArticle } = userCreateArticle;
    const { commentController } = API;

    const newComment = {
      comment: {
        body: await createRandomComment(),
      },
    };

    const addCommentToArticleResponse =
      await commentController.addCommentToArticle(
        createdArticle,
        newComment,
        token,
      );

    await commentController.expectResponseStatusCode(
      addCommentToArticleResponse,
      200,
    );

    await use({ API, token, createdArticle });
  },
});
