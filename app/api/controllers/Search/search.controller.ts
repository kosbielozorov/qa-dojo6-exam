// 1. Search article by name
// 2. Search article by tag

import { BaseController } from '../base.controller';

export class SearchController extends BaseController {
  /**
   * Retrieves articles from the API endpoint.
   *
   * @param params - Optional query parameters to filter or modify the articles request
   * @returns Promise that resolves to the API response containing articles data
   */
  async getArticles(params?) {
    let response;

    response = await this.getReq('/api/articles', { params });

    return response;
  }

  /**
   * Retrieves an article by its slug identifier.
   *
   * @param slug - The unique slug identifier for the article
   * @returns A promise that resolves to the article data response
   * @throws May throw an error if the API request fails
   */
  async getArticlesBySlug(slug) {
    let response;

    response = await this.getReq(`/api/articles/${slug}`);

    return response;
  }
}
