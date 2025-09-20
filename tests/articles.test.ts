import { test } from 'app/fixtures';
import { createRandomArticle } from 'helpers/createRandomArticle';
import { createRandomUser } from 'helpers/createRandomUser';

test.describe('Articles', () => {});

test.describe(
  'Create Article',
  {
    tag: ['@createArticle'],
  },
  () => {
    test(
      'CON-013 Create new article',
      {
        tag: ['@CON-013'],
      },
      async ({
        registerNewUser: {
          API: { articleController },
          token,
        },
      }) => {
        const { title, description, body } = await createRandomArticle();

        const createArticleResponse = await articleController.createArticle(
          { title, description, body },
          token,
        );

        await articleController.expectResponseStatusCode(
          createArticleResponse,
          200,
        );
        const createdArticle = (await createArticleResponse.json()).article;

        await articleController.expectResponseHaveProperty(
          createdArticle,
          'slug',
        );
        await articleController.expectResponseHaveProperty(
          createdArticle,
          'title',
        );
        await articleController.expectResponseHaveProperty(
          createdArticle,
          'description',
        );
        await articleController.expectResponseHaveProperty(
          createdArticle,
          'body',
        );
        await articleController.expectResponseHaveProperty(
          createdArticle,
          'createdAt',
        );
        await articleController.expectResponseHaveProperty(
          createdArticle,
          'updatedAt',
        );
        await articleController.expectResponseHaveProperty(
          createdArticle,
          'tagList',
        );
        await articleController.expectResponseHaveProperty(
          createdArticle,
          'favorited',
        );
        await articleController.expectResponseHaveProperty(
          createdArticle,
          'favoritesCount',
        );
        await articleController.expectResponseHaveProperty(
          createdArticle,
          'author',
        );
      },
    );

    test(
      'CON-014 Create new article without token',
      {
        tag: ['@CON-014'],
      },
      async ({
        registerNewUser: {
          API: { articleController },
        },
      }) => {
        const { title, description, body } = await createRandomArticle();
        const token = '';

        const createArticleResponse = await articleController.createArticle(
          { title, description, body },
          token,
        );

        await articleController.expectResponseStatusCode(
          createArticleResponse,
          401,
        );
      },
    );

    test(
      'CON-015 Create new article with empty title',
      {
        tag: ['@CON-015'],
      },
      async ({
        registerNewUser: {
          API: { articleController },
          token,
        },
      }) => {
        const { description, body } = await createRandomArticle();
        const title = '';

        const createArticleResponse = await articleController.createArticle(
          { title, description, body },
          token,
        );

        await articleController.expectResponseStatusCode(
          createArticleResponse,
          422,
        );
      },
    );
  },
);

test.describe(
  'Edit articles',
  {
    tag: ['@editArticle'],
  },
  () => {
    test(
      'CON-016 Edit own article',
      {
        tag: ['@CON-016'],
      },
      async ({
        userCreateArticle: {
          API: { articleController },
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

        await articleController.expectResponseStatusCode(
          editArticleResponse,
          200,
        );

        const editedArticle = (await editArticleResponse.json()).article;

        await articleController.expectResponseHaveProperty(
          editedArticle,
          'slug',
        );
        await articleController.expectResponseHaveProperty(
          editedArticle,
          'title',
        );
        await articleController.expectResponseHaveProperty(
          editedArticle,
          'description',
        );
        await articleController.expectResponseHaveProperty(
          editedArticle,
          'body',
        );
        await articleController.expectResponseHaveProperty(
          editedArticle,
          'createdAt',
        );
        await articleController.expectResponseHaveProperty(
          editedArticle,
          'updatedAt',
        );
        await articleController.expectResponseHaveProperty(
          editedArticle,
          'tagList',
        );
        await articleController.expectResponseHaveProperty(
          editedArticle,
          'favorited',
        );
        await articleController.expectResponseHaveProperty(
          editedArticle,
          'favoritesCount',
        );
        await articleController.expectResponseHaveProperty(
          editedArticle,
          'author',
        );
      },
    );

    test(
      'CON-017 Edit article of another user',
      {
        tag: ['@CON-017'],
      },
      async ({
        userCreateArticle: {
          API: { articleController, userController },
          createdArticle,
        },
      }) => {
        const { firstName, email, password } = await createRandomUser();

        const createUserResponse = await userController.signUpUser({
          username: firstName,
          email: email,
          password: password,
        });

        await userController.expectResponseStatusCode(createUserResponse, 200);

        const token = (await createUserResponse.json()).user.token;

        const editArticle = { ...createdArticle };
        editArticle.article.title = `Edited ${editArticle.article.title}`;

        const editArticleResponse = await articleController.editArticle(
          { ...editArticle.article },
          token,
        );

        await articleController.expectResponseStatusCode(
          editArticleResponse,
          403,
        );
      },
    );

    test(
      'CON-018 Edit not existing article',
      {
        tag: ['@CON-018'],
      },
      async ({
        registerNewUser: {
          API: { articleController },
          token,
        },
      }) => {
        const createdArticle = await createRandomArticle();

        const editArticle = { article: { ...createdArticle } };
        editArticle.article.title = `Edited ${editArticle.article.title}`;

        const editArticleResponse = await articleController.editArticle(
          { ...editArticle.article },
          token,
        );

        await articleController.expectResponseStatusCode(
          editArticleResponse,
          404,
        );
      },
    );
  },
);

test.describe(
  'Delete articles',
  {
    tag: ['@deleteArticle'],
  },
  () => {
    test(
      'CON-019 Delete own article',
      {
        tag: ['@CON-019'],
      },
      async ({
        userCreateArticle: {
          API: { articleController },
          token,
          createdArticle,
        },
      }) => {
        const articleToDelete = { ...createdArticle };

        const deleteArticleResponse = await articleController.deleteArticle(
          { ...articleToDelete.article },
          token,
        );

        await articleController.expectResponseStatusCode(
          deleteArticleResponse,
          204,
        );
      },
    );

    test(
      'CON-020 Delete article of another user',
      {
        tag: ['@CON-020'],
      },
      async ({
        userCreateArticle: {
          API: { articleController, userController },
          createdArticle,
        },
      }) => {
        const { firstName, email, password } = await createRandomUser();

        const createUserResponse = await userController.signUpUser({
          username: firstName,
          email: email,
          password: password,
        });

        await userController.expectResponseStatusCode(createUserResponse, 200);

        const token = (await createUserResponse.json()).user.token;

        const articleToDelete = { ...createdArticle };

        const editArticleResponse = await articleController.deleteArticle(
          { ...articleToDelete.article },
          token,
        );

        await articleController.expectResponseStatusCode(
          editArticleResponse,
          403,
        );
      },
    );

    test(
      'CON-021 Delete not existing article',
      {
        tag: ['@CON-021'],
      },
      async ({
        registerNewUser: {
          API: { articleController },
          token,
        },
      }) => {
        const createdArticle = await createRandomArticle();

        const articleToDelete = { article: { ...createdArticle } };

        const editArticleResponse = await articleController.deleteArticle(
          { ...articleToDelete.article },
          token,
        );

        await articleController.expectResponseStatusCode(
          editArticleResponse,
          404,
        );
      },
    );
  },
);

test.describe(
  'Add article to favorites',
  {
    tag: ['@addArticleToFavorites'],
  },
  () => {
    test(
      'CON-024 Add article to favorites',
      {
        tag: ['@CON-024'],
      },
      async ({
        userCreateArticle: {
          API: { articleController },
          token,
          createdArticle,
        },
      }) => {
        const addArticleToFavoritesResponse =
          await articleController.addArticleToFavorites(createdArticle, token);

        await articleController.expectResponseStatusCode(
          addArticleToFavoritesResponse,
          200,
        );

        const favoritedArticle = (await addArticleToFavoritesResponse.json())
          .article;

        await articleController.expectResponseHaveProperty(
          favoritedArticle,
          'favoritesCount',
        );
        await articleController.expectResponsePropertyHavePositiveValue(
          favoritedArticle,
          'favorited',
        );
        await articleController.expectResponsePropertyHaveValue(
          favoritedArticle,
          'favoritesCount',
          1,
        );
      },
    );

    test(
      'CON-031 Add article to favorites without auth token',
      {
        tag: ['@CON-031'],
      },
      async ({
        userCreateArticle: {
          API: { articleController },
          createdArticle,
        },
      }) => {
        const addArticleToFavoritesResponse =
          await articleController.addArticleToFavorites(createdArticle, '');

        await articleController.expectResponseStatusCode(
          addArticleToFavoritesResponse,
          401,
        );
      },
    );

    test(
      'CON-032 Add non existent article to favorites',
      {
        tag: ['@CON-032'],
      },
      async ({
        registerNewUser: {
          API: { articleController },
          token,
        },
      }) => {
        const nonExistingArticle = {
          article: {
            ...(await createRandomArticle()),
            slug: 'non-existent-slug',
          },
        };

        const addArticleToFavoritesResponse =
          await articleController.addArticleToFavorites(
            nonExistingArticle,
            token,
          );

        await articleController.expectResponseStatusCode(
          addArticleToFavoritesResponse,
          404,
        );
      },
    );

    test(
      'CON-033 Delete article from favorites',
      {
        tag: ['@CON-033'],
      },
      async ({
        userCreateArticle: {
          API: { articleController },
          token,
          createdArticle,
        },
      }) => {
        const addArticleToFavoritesResponse =
          await articleController.addArticleToFavorites(createdArticle, token);

        await articleController.expectResponseStatusCode(
          addArticleToFavoritesResponse,
          200,
        );

        const deleteFromFavoritesArticleResponse =
          await articleController.deleteArticleFromFavorites(
            createdArticle,
            token,
          );

        await articleController.expectResponseStatusCode(
          deleteFromFavoritesArticleResponse,
          200,
        );

        const favoritedArticle = (
          await deleteFromFavoritesArticleResponse.json()
        ).article;

        await articleController.expectResponseHaveProperty(
          favoritedArticle,
          'favoritesCount',
        );
        await articleController.expectResponsePropertyHaveNegativeValue(
          favoritedArticle,
          'favorited',
        );
        await articleController.expectResponsePropertyHaveValue(
          favoritedArticle,
          'favoritesCount',
          0,
        );
      },
    );

    test(
      'CON-034 Delete article from favorites without auth token',
      {
        tag: ['@CON-034'],
      },
      async ({
        userCreateArticle: {
          API: { articleController },
          token,
          createdArticle,
        },
      }) => {
        const addArticleToFavoritesResponse =
          await articleController.addArticleToFavorites(createdArticle, token);

        await articleController.expectResponseStatusCode(
          addArticleToFavoritesResponse,
          200,
        );

        const deleteFromFavoritesArticleResponse =
          await articleController.deleteArticleFromFavorites(
            createdArticle,
            '',
          );

        await articleController.expectResponseStatusCode(
          deleteFromFavoritesArticleResponse,
          401,
        );
      },
    );

    test(
      'CON-35 Repeat adding same article to favorites',
      {
        tag: ['@CON-35'],
      },
      async ({
        userCreateArticle: {
          API: { articleController },
          token,
          createdArticle,
        },
      }) => {
        const addArticleToFavoritesResponse =
          await articleController.addArticleToFavorites(createdArticle, token);

        await articleController.expectResponseStatusCode(
          addArticleToFavoritesResponse,
          200,
        );

        await articleController.addArticleToFavorites(createdArticle, token);
        await articleController.expectResponseStatusCode(
          addArticleToFavoritesResponse,
          200,
        );

        const favoritedArticle = (await addArticleToFavoritesResponse.json())
          .article;

        await articleController.expectResponseHaveProperty(
          favoritedArticle,
          'favoritesCount',
        );
        await articleController.expectResponsePropertyHavePositiveValue(
          favoritedArticle,
          'favorited',
        );
        await articleController.expectResponsePropertyHaveValue(
          favoritedArticle,
          'favoritesCount',
          1,
        );
      },
    );
  },
);
