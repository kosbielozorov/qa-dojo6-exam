import { test } from 'app/fixtures';

test.describe(
  'Search articles',
  {
    tag: ['@search'],
  },
  () => {
    test(
      'CON-021 Get all articles',
      {
        tag: ['@CON-021'],
      },
      async ({ API: { searchController } }) => {
        const searchAllArticlesResponse = await searchController.getArticles();

        await searchController.expectResponseStatusCode(
          searchAllArticlesResponse,
          200,
        );

        const responseBody = await searchAllArticlesResponse.json();

        await searchController.expectResponseHaveProperty(
          responseBody,
          'articles',
        );
        await searchController.expectResponseHaveProperty(
          responseBody,
          'articlesCount',
        );
      },
    );

    test(
      'CON-022 Get articles with pagination',
      {
        tag: ['@CON-022'],
      },
      async ({ API: { searchController } }) => {
        const searchAllArticlesResponse = await searchController.getArticles({
          limit: 10,
          offset: 0,
        });

        await searchController.expectResponseStatusCode(
          searchAllArticlesResponse,
          200,
        );

        const responseBody = await searchAllArticlesResponse.json();

        await searchController.expectResponseHaveProperty(
          responseBody,
          'articles',
        );
        await searchController.expectResponseHaveProperty(
          responseBody,
          'articlesCount',
        );
        await searchController.expectResponsePropertyHaveValue(
          responseBody,
          'articles',
          10,
        );
        await searchController.expectResponsePropertyHavePositiveValue(
          responseBody,
          'articlesCount',
        );
      },
    );

    test(
      'CON-025 Get articles by favorited',
      {
        tag: ['@CON-025'],
      },
      async ({
        userCreateArticle: {
          API: { searchController, articleController },
          createdArticle,
          token,
        },
      }) => {
        const { author } = createdArticle.article;

        await articleController.addArticleToFavorites(createdArticle, token);

        const searchAllFavoritedArticlesByAuthorResponse =
          await searchController.getArticles({
            favorited: author.username,
          });

        await searchController.expectResponseStatusCode(
          searchAllFavoritedArticlesByAuthorResponse,
          200,
        );

        const responseBody =
          await searchAllFavoritedArticlesByAuthorResponse.json();

        await searchController.expectResponseHaveProperty(
          responseBody,
          'articles',
        );
        await searchController.expectResponsePropertyHaveValue(
          responseBody,
          'articlesCount',
          1,
        );
        await searchController.expectResponsePropertyHaveValue(
          responseBody,
          'articles',
          1,
        );
        await searchController.expectResponsePropertyHaveValue(
          responseBody.articles[0],
          'favoritesCount',
          1,
        );
        await searchController.expectResponsePropertyHavePositiveValue(
          responseBody.articles[0],
          'favorited',
        );
      },
    );
  },
);

test.describe(
  'Search articles by author',
  {
    tag: ['@search', '@author'],
  },
  () => {
    test(
      'CON-023 Get articles by author',
      {
        tag: ['@CON-023'],
      },
      async ({
        userCreateArticle: {
          API: { searchController },
          createdArticle,
        },
      }) => {
        const authorUsername = createdArticle.article.author.username;

        const searchAllArticlesResponse = await searchController.getArticles({
          author: authorUsername,
        });

        await searchController.expectResponseStatusCode(
          searchAllArticlesResponse,
          200,
        );

        const responseBody = await searchAllArticlesResponse.json();

        await searchController.expectResponseHaveProperty(
          responseBody,
          'articles',
        );
        await searchController.expectResponseHaveProperty(
          responseBody,
          'articlesCount',
        );
        await searchController.expectResponsePropertyHaveValue(
          responseBody,
          'articles',
          1,
        );
        await searchController.expectResponsePropertyHavePositiveValue(
          responseBody,
          'articlesCount',
        );
      },
    );

    test(
      'CON-030 Get articles by non existent author',
      {
        tag: ['@CON-030'],
      },
      async ({ API: { searchController } }) => {
        const searchAllArticlesResponse = await searchController.getArticles({
          author: 'nonexistentauthor',
        });

        await searchController.expectResponseStatusCode(
          searchAllArticlesResponse,
          404,
        );
      },
    );
  },
);

test.describe(
  'Search articles by slug',
  {
    tag: ['@search', '@slug'],
  },
  () => {
    test(
      'CON-026 Get articles by slug',
      {
        tag: ['@CON-026'],
      },
      async ({
        userCreateArticle: {
          API: { searchController },
          createdArticle,
        },
      }) => {
        const { slug } = createdArticle.article;

        const searchAllArticlesBySlugResponse =
          await searchController.getArticlesBySlug(slug);

        await searchController.expectResponseStatusCode(
          searchAllArticlesBySlugResponse,
          200,
        );

        const responseBody = await searchAllArticlesBySlugResponse.json();

        await searchController.expectResponsePropertyHaveValue(
          responseBody.article,
          'slug',
          `${slug}`,
        );
      },
    );

    test(
      'CON-027 Get articles by non existent slug',
      {
        tag: ['@CON-027'],
      },
      async ({
        userCreateArticle: {
          API: { searchController },
          createdArticle,
        },
      }) => {
        const { slug } = createdArticle.article;

        const searchAllArticlesBySlugResponse =
          await searchController.getArticlesBySlug(`${slug}-nonexistent`);

        await searchController.expectResponseStatusCode(
          searchAllArticlesBySlugResponse,
          404,
        );
      },
    );
  },
);

test.describe(
  'Search articles by tag',
  {
    tag: ['@search', '@tag'],
  },
  () => {
    test(
      'CON-028 Get articles by tag',
      {
        tag: ['@CON-028'],
      },
      async ({
        userCreateArticle: {
          API: { searchController },
          createdArticle,
        },
      }) => {
        const { tagList } = createdArticle.article;

        const searchAllArticlesByTagResponse =
          await searchController.getArticles({
            tag: tagList[0],
          });

        await searchController.expectResponseStatusCode(
          searchAllArticlesByTagResponse,
          200,
        );

        const responseBody = await searchAllArticlesByTagResponse.json();

        await searchController.expectResponseHaveProperty(
          responseBody,
          'articles',
        );
        for (const item of responseBody.articles) {
          await searchController.expectResponsePropertyHaveValues(
            item,
            'tagList',
            tagList[0],
          );
        }
        await searchController.expectResponseHaveProperty(
          responseBody,
          'articlesCount',
        );
        await searchController.expectResponsePropertyHavePositiveValue(
          responseBody,
          'articlesCount',
        );
      },
    );

    test(
      'CON-029 Get articles by not existent tag',
      {
        tag: ['@CON-029'],
      },
      async ({ API: { searchController } }) => {
        const searchAllArticlesResponse = await searchController.getArticles({
          tag: 'non-existent-tag',
        });

        await searchController.expectResponseStatusCode(
          searchAllArticlesResponse,
          200,
        );

        const responseBody = await searchAllArticlesResponse.json();

        await searchController.expectResponseHaveProperty(
          responseBody,
          'articles',
        );
        await searchController.expectResponseHaveProperty(
          responseBody,
          'articlesCount',
        );
        await searchController.expectResponsePropertyHaveValue(
          responseBody,
          'articlesCount',
          0,
        );
      },
    );
  },
);
