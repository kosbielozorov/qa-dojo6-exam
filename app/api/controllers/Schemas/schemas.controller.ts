import test from '@playwright/test';
import Joi from 'joi';
import { BaseController } from '../base.controller';

export class SchemasController extends BaseController {
  async validateResponseSchema(response, schema) {
    await test.step('Expect: response correspond to the schema', async () => {
      Joi.assert(await response.json(), schema, {
        abortEarly: false,
      });
    });
  }
}
