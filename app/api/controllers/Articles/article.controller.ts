import test from '@playwright/test';
import { BaseController } from '../base.controller';

export class ArticleController extends BaseController {
  /**
   * Creates a new article by sending a POST request to the articles API endpoint.
   *
   * @param article - The article object containing the article data to be created
   * @param token - The authentication token used for authorization
   * @returns A promise that resolves to the HTTP response from the article creation request
   *
   * @example
   * ```typescript
   * const articleData = { title: "My Article", content: "Article content" };
   * const authToken = "your-auth-token";
   * const response = await createArticle(articleData, authToken);
   * ```
   */
  async createArticle(article, token: string) {
    let response;

    await test.step('Create new article', async () => {
      response = await this.postReq(
        '/api/articles',
        { article },
        { headers: { Authorization: `Bearer ${token}` } },
      );
    });

    return response;
  }

  /**
   * Edits an existing article by sending a PUT request to the articles API endpoint.
   *
   * @param editedArticle - The article object containing the updated article data and slug
   * @param token - The authentication bearer token for API authorization
   * @returns Promise that resolves to the API response from the edit article request
   *
   * @example
   * ```typescript
   * const editedArticle = { slug: 'my-article', title: 'Updated Title' };
   * const token = 'your-auth-token';
   * const response = await editArticle(editedArticle, token);
   * ```
   */
  async editArticle(editedArticle, token: string) {
    let response;
    const { slug } = editedArticle;

    await test.step('Edit article', async () => {
      response = await this.putReq(
        `/api/articles/${slug}`,
        { article: { editedArticle } },
        { headers: { Authorization: `Bearer ${token}` } },
      );
    });

    return response;
  }

  /**
   * Deletes an article using the provided slug and authorization token.
   *
   * @param articleToDelete - The article object containing the slug to identify the article to delete
   * @param token - The authorization token for authenticating the delete request
   * @returns Promise that resolves to the API response from the delete operation
   *
   * @example
   * ```typescript
   * const article = { slug: 'my-article-slug' };
   * const authToken = 'your-auth-token';
   * const response = await deleteArticle(article, authToken);
   * ```
   */
  async deleteArticle(articleToDelete, token: string) {
    let response;
    const { slug } = articleToDelete;

    await test.step('Delete article', async () => {
      response = await this.delReq(
        `/api/articles/${slug}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
    });

    return response;
  }

  /**
   * Adds an article to the user's favorites list.
   *
   * @param article - The article object containing article details including slug
   * @param token - The JWT authentication token for the user
   * @returns Promise<Response> The HTTP response from the favorite article API endpoint
   *
   * @example
   * ```typescript
   * const article = { article: { slug: 'example-article' } };
   * const token = 'jwt-token-here';
   * const response = await addArticleToFavorites(article, token);
   * ```
   */
  async addArticleToFavorites(article, token: string) {
    let response;
    const { slug } = article.article;

    await test.step('Add article to favorites', async () => {
      response = await this.postReq(
        `/api/articles/${slug}/favorite`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );
    });

    return response;
  }

  /**
   * Removes an article from the user's favorites list.
   *
   * @param article - The article object containing the article details with a slug property
   * @param token - The JWT bearer token for user authentication
   * @returns Promise<Response> The HTTP response from the delete favorites API call
   *
   * @example
   * ```typescript
   * const article = { article: { slug: 'my-article-slug' } };
   * const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
   * const response = await deleteArticleFromFavorites(article, token);
   * ```
   */
  async deleteArticleFromFavorites(article, token: string) {
    let response;
    const { slug } = article.article;

    await test.step('Delete article to favorites', async () => {
      response = await this.delReq(
        `/api/articles/${slug}/favorite`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );
    });

    return response;
  }
}
