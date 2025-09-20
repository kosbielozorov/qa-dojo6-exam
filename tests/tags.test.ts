import { test } from 'app/fixtures';

test.describe('Tags', { tag: ['@tags'] }, () => {
  test(
    'CON-044 Get tags',
    { tag: ['@CON-044'] },
    async ({ API: { tagsController } }) => {
      const getAllTagsResponse = await tagsController.getTags();

      await tagsController.expectResponseStatusCode(getAllTagsResponse, 200);

      const responseBody = await getAllTagsResponse.json();

      await tagsController.expectResponseHaveProperty(responseBody, 'tags');
      await tagsController.expectResponsePropertyHaveValues(
        responseBody,
        'tags',
        'kos',
      );
    },
  );

  test(
    'CON-045 Get articles by tag and author',
    {
      tag: ['@CON-045'],
    },
    async ({
      userCreateArticle: {
        API: { searchController, tagsController },
        createdArticle,
      },
    }) => {
      const { tagList, author } = createdArticle.article;

      const searchAllArticlesByTagAndAuthorResponse =
        await searchController.getArticles({
          tag: tagList[0],
          author: author.username,
        });

      await tagsController.expectResponseStatusCode(
        searchAllArticlesByTagAndAuthorResponse,
        200,
      );

      const responseBody = await searchAllArticlesByTagAndAuthorResponse.json();

      await tagsController.expectResponseHaveProperty(responseBody, 'articles');
      for (const item of responseBody.articles) {
        await tagsController.expectResponsePropertyHaveValues(
          item,
          'tagList',
          tagList[0],
        );
      }
      await tagsController.expectResponseHaveProperty(
        responseBody,
        'articlesCount',
      );
      await tagsController.expectResponsePropertyHavePositiveValue(
        responseBody,
        'articlesCount',
      );
    },
  );
});
