import Joi from 'joi';
import { articleSchema } from './article.schema';

export const articleResponseSchema = Joi.object({
  article: articleSchema.required(),
});
