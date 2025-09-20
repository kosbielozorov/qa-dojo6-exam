import { test } from 'app/fixtures';
import { createRandomArticle } from 'helpers/createRandomArticle';
import { createRandomComment } from 'helpers/createRandomComment';
import { createRandomUser } from 'helpers/createRandomUser';

test.describe(
  'Create comments',
  {
    tag: ['@comments'],
  },
  () => {
    test(
      'CON-036 Add comment to article',
      { tag: ['@CON-036'] },
      async ({
        userCreateArticle: {
          API: { commentController },
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

        await commentController.expectResponseStatusCode(
          addCommentToArticleResponse,
          200,
        );

        const commentArticle = await addCommentToArticleResponse.json();

        await commentController.expectResponseHaveProperty(
          commentArticle,
          'comment',
        );
        await commentController.expectResponseHaveProperty(
          commentArticle.comment,
          'id',
        );
        await commentController.expectResponseHaveProperty(
          commentArticle.comment,
          'createdAt',
        );
        await commentController.expectResponseHaveProperty(
          commentArticle.comment,
          'author',
        );
      },
    );

    test(
      'CON-037 Add comment to article without auth token',
      { tag: ['@CON-037'] },
      async ({
        userCreateArticle: {
          API: { commentController },
          createdArticle,
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
            '',
          );

        await commentController.expectResponseStatusCode(
          addCommentToArticleResponse,
          401,
        );
      },
    );

    test(
      'CON-038 Add comment to article with empty comment body',
      { tag: ['@CON-038'] },
      async ({
        userCreateArticle: {
          API: { commentController },
          createdArticle,
          token,
        },
      }) => {
        const newComment = {
          comment: {
            body: '',
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
          422,
        );
      },
    );
  },
);

test.describe('Get comments', () => {
  test(
    'CON-039 Get comments for article',
    { tag: ['@CON-039'] },
    async ({
      userCreateArticle: {
        API: { commentController },
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

      await commentController.expectResponseStatusCode(
        addCommentToArticleResponse,
        200,
      );

      const getCommentsToArticleResponse =
        await commentController.getCommentsToArticle(createdArticle);

      await commentController.expectResponseStatusCode(
        getCommentsToArticleResponse,
        200,
      );

      const commentsToArticle = await getCommentsToArticleResponse.json();

      await commentController.expectResponseHaveProperty(
        commentsToArticle,
        'comments',
      );
      await commentController.expectResponsePropertyHaveValue(
        commentsToArticle,
        'comments',
        1,
      );

      await commentController.expectResponseHaveProperty(
        commentsToArticle.comments[0],
        'id',
      );
      await commentController.expectResponseHaveProperty(
        commentsToArticle.comments[0],
        'createdAt',
      );
      await commentController.expectResponseHaveProperty(
        commentsToArticle.comments[0],
        'author',
      );
    },
  );

  test(
    'CON-040 Get comments for non existent article',
    { tag: ['@CON-040'] },
    async ({
      registerNewUser: {
        API: { commentController },
      },
    }) => {
      const createdArticle = await createRandomArticle();

      const articleToGetComments = { article: { ...createdArticle } };

      const getCommentsToArticleResponse =
        await commentController.getCommentsToArticle(articleToGetComments);

      await commentController.expectResponseStatusCode(
        getCommentsToArticleResponse,
        404,
      );
    },
  );
});

test.describe('Delete comments', () => {
  test(
    'CON-041 Delete comment by id for own article',
    { tag: ['@CON-041'] },
    async ({
      userCreateArticleWithComments: {
        API: { commentController },
        createdArticle,
        token,
      },
    }) => {
      const getCommentsToArticleResponse =
        await commentController.getCommentsToArticle(createdArticle);

      const commentId = (await getCommentsToArticleResponse.json()).comments[0]
        .id;

      const deleteCommentByIdResponse =
        await commentController.deleteCommentToArticle(
          createdArticle,
          commentId,
          token,
        );

      await commentController.expectResponseStatusCode(
        deleteCommentByIdResponse,
        204,
      );

      const checkCommentsToArticleResponse =
        await commentController.getCommentsToArticle(createdArticle);

      const commentsToArticle = await checkCommentsToArticleResponse.json();

      await commentController.expectResponsePropertyHaveValue(
        commentsToArticle,
        'comments',
        0,
      );
    },
  );

  test(
    'CON-042 Delete comment by id for article of another user',
    { tag: ['@CON-042'] },
    async ({
      userCreateArticleWithComments: {
        API: { commentController, userController },
        createdArticle,
      },
    }) => {
      const { firstName, email, password } = await createRandomUser();

      const signUpUserResponse = await userController.signUpUser({
        username: firstName,
        email: email,
        password: password,
      });

      const token = (await signUpUserResponse.json()).user.token;

      const getCommentsToArticleResponse =
        await commentController.getCommentsToArticle(createdArticle);

      const commentId = (await getCommentsToArticleResponse.json()).comments[0]
        .id;

      const deleteCommentByIdResponse =
        await commentController.deleteCommentToArticle(
          createdArticle,
          commentId,
          token,
        );

      await commentController.expectResponseStatusCode(
        deleteCommentByIdResponse,
        403,
      );
    },
  );

  test(
    'CON-043 Delete comment by id for own article without auth',
    { tag: ['@CON-043'] },
    async ({
      userCreateArticleWithComments: {
        API: { commentController },
        createdArticle,
      },
    }) => {
      const getCommentsToArticleResponse =
        await commentController.getCommentsToArticle(createdArticle);

      const commentId = (await getCommentsToArticleResponse.json()).comments[0]
        .id;

      const deleteCommentByIdResponse =
        await commentController.deleteCommentToArticle(
          createdArticle,
          commentId,
          '',
        );

      await commentController.expectResponseStatusCode(
        deleteCommentByIdResponse,
        401,
      );
    },
  );

  test(
    'CON-044 Delete comment by id for own article without auth',
    { tag: ['@CON-044'] },
    async ({
      userCreateArticleWithComments: {
        API: { commentController },
        createdArticle,
        token,
      },
    }) => {
      const deleteCommentByIdResponse =
        await commentController.deleteCommentToArticle(
          createdArticle,
          '8comment8Id8',
          token,
        );

      await commentController.expectResponseStatusCode(
        deleteCommentByIdResponse,
        404,
      );
    },
  );
});
