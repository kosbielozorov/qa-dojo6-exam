import test from '@playwright/test';
import { BaseController } from '../base.controller';

export class CommentController extends BaseController {
  /**
   * Adds a comment to a specific article.
   *
   * @param article - The article object containing the article slug
   * @param comment - The comment object to be added to the article
   * @param token - The authorization bearer token for authenticated requests
   * @returns Promise that resolves to the HTTP response from the comment creation request
   *
   * @example
   * ```typescript
   * const response = await addCommentToArticle(
   *   { article: { slug: 'my-article' } },
   *   { body: 'Great article!' },
   *   'your-auth-token'
   * );
   * ```
   */
  async addCommentToArticle(article, comment, token: string) {
    let response;
    const { slug } = article.article;

    await test.step('Add comment to article', async () => {
      response = await this.postReq(
        `/api/articles/${slug}/comments`,
        { comment },
        { headers: { Authorization: `Bearer ${token}` } },
      );
    });

    return response;
  }

  /**
   * Retrieves all comments associated with a specific article.
   *
   * @param article - The article object containing the article data with a slug property
   * @param article.article - The nested article object
   * @param article.article.slug - The unique slug identifier for the article
   * @returns A Promise that resolves to the response containing the comments for the specified article
   *
   * @example
   * ```typescript
   * const article = { article: { slug: 'my-article-slug' } };
   * const comments = await getCommentsToArticle(article);
   * ```
   */
  async getCommentsToArticle(article) {
    let response;
    const { slug } = article.article;

    await test.step('Get comments to article', async () => {
      response = await this.getReq(`/api/articles/${slug}/comments`);
    });

    return response;
  }

  /**
   * Deletes a comment from an article by comment ID.
   *
   * @param article - The article object containing the article slug
   * @param commentId - The unique identifier of the comment to delete
   * @param token - The authorization token for the authenticated user
   * @returns Promise that resolves to the HTTP response from the delete operation
   */
  async deleteCommentToArticle(article, commentId, token: string) {
    let response;
    const { slug } = article.article;

    await test.step('Delete comment to article by id', async () => {
      response = await this.delReq(
        `/api/articles/${slug}/comments/${commentId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );
    });

    return response;
  }
}
