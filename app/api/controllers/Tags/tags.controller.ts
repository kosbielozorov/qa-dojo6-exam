import test from '@playwright/test';
import { BaseController } from '../base.controller';

export class TagsController extends BaseController {
  /**
   * Retrieves all available tags from the API.
   *
   * This method performs a GET request to the `/api/tags` endpoint within a test step
   * to fetch the complete list of tags.
   *
   * @returns {Promise<any>} A promise that resolves to the API response containing the tags data
   */
  async getTags() {
    let response;

    await test.step('Get tags', async () => {
      response = await this.getReq('/api/tags');
    });

    return response;
  }
}
