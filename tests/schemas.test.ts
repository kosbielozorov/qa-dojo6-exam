import { articleResponseSchema } from 'app/api/schemas/articles/createArticle.schema';
import { commentResponseSchema } from 'app/api/schemas/comments/comment.schema';
import { searchArticlesResponseSchema } from 'app/api/schemas/search/searchAll.schema';
import { tagsResponseSchema } from 'app/api/schemas/tags/tags.schemas';
import { editUserResponseSchema } from 'app/api/schemas/users/editUser.schema';
import { userResponseSchema } from 'app/api/schemas/users/signUpUser.schema';
import { test } from 'app/fixtures';
import { createRandomArticle } from 'helpers/createRandomArticle';
import { createRandomComment } from 'helpers/createRandomComment';
import { createRandomUser } from 'helpers/createRandomUser';

test.describe('Schemas', { tag: ['@schemas'] }, () => {
  test(
    'CON-061 Sign up a new user response schema should validate correct data',
    {
      tag: ['@CON-061'],
    },
    async ({ API: { userController, schemasController } }) => {
      const { firstName, email, password } = await createRandomUser();

      const signUpUserResponse = await userController.signUpUser({
        username: firstName,
        email: email,
        password: password,
      });

      await schemasController.validateResponseSchema(
        signUpUserResponse,
        userResponseSchema,
      );
    },
  );

  test(
    'CON-062 Sign in with existing user response schema should validate correct data',
    {
      tag: ['@CON-062'],
    },
    async ({
      registerNewUser: {
        API: { userController, schemasController },
        user,
      },
    }) => {
      const { email, password } = user;

      const signInUserResponse = await userController.signInUser({
        email,
        password,
      });

      await schemasController.validateResponseSchema(
        signInUserResponse,
        userResponseSchema,
      );
    },
  );

  test(
    'CON-063 Update user profile response schema should validate correct data',
    {
      tag: ['@CON-063'],
    },
    async ({
      registerNewUser: {
        API: { userController, schemasController },
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

      await schemasController.validateResponseSchema(
        editUserProfileResponse,
        editUserResponseSchema,
      );
    },
  );

  test(
    'CON-064 Create new article response schema should validate correct data',
    {
      tag: ['@CON-064'],
    },
    async ({
      registerNewUser: {
        API: { articleController, schemasController },
        token,
      },
    }) => {
      const { title, description, body } = await createRandomArticle();

      const createArticleResponse = await articleController.createArticle(
        { title, description, body },
        token,
      );

      await schemasController.validateResponseSchema(
        createArticleResponse,
        articleResponseSchema,
      );
    },
  );

  test(
    'CON-065 Edit own article response schema should validate correct data',
    {
      tag: ['@CON-065'],
    },
    async ({
      userCreateArticle: {
        API: { articleController, schemasController },
        token,
        createdArticle,
      },
    }) => {
      const editArticle = { ...createdArticle };
      editArticle.article.title = `Edited ${editArticle.article.title}`;
      const editArticleResponse = await articleController.editArticle(
        { ...editArticle.article },
        token,
      );

      await schemasController.validateResponseSchema(
        editArticleResponse,
        articleResponseSchema,
      );
    },
  );

  test(
    'CON-066 Add article to favorites response schema should validate correct data',
    {
      tag: ['@CON-066'],
    },
    async ({
      userCreateArticle: {
        API: { articleController, schemasController },
        token,
        createdArticle,
      },
    }) => {
      const addArticleToFavoritesResponse =
        await articleController.addArticleToFavorites(createdArticle, token);

      await schemasController.validateResponseSchema(
        addArticleToFavoritesResponse,
        articleResponseSchema,
      );
    },
  );

  test(
    'CON-067 Delete article from favorites response schema should validate correct data',
    {
      tag: ['@CON-067'],
    },
    async ({
      userCreateArticle: {
        API: { articleController, schemasController },
        token,
        createdArticle,
      },
    }) => {
      const deleteArticleToFavoritesResponse =
        await articleController.addArticleToFavorites(createdArticle, token);

      await schemasController.validateResponseSchema(
        deleteArticleToFavoritesResponse,
        articleResponseSchema,
      );
    },
  );

  test(
    'CON-068 Add comment to article response schema should validate correct data',
    { tag: ['@CON-068'] },
    async ({
      userCreateArticle: {
        API: { commentController, schemasController },
        createdArticle,
        token,
      },
    }) => {
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

      await schemasController.validateResponseSchema(
        addCommentToArticleResponse,
        commentResponseSchema,
      );
    },
  );

  test(
    'CON-069 Get all articles response schema should validate correct data',
    {
      tag: ['@CON-069'],
    },
    async ({ API: { searchController, schemasController } }) => {
      const searchAllArticlesResponse = await searchController.getArticles();

      await schemasController.validateResponseSchema(
        searchAllArticlesResponse,
        searchArticlesResponseSchema,
      );
    },
  );

  test(
    'CON-070 Get tags response schema should validate correct data',
    { tag: ['@CON-070'] },
    async ({ API: { tagsController, schemasController } }) => {
      const getAllTagsResponse = await tagsController.getTags();

      await schemasController.validateResponseSchema(
        getAllTagsResponse,
        tagsResponseSchema,
      );
    },
  );
});
