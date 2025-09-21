import Joi from 'joi';
import { articleSchema } from './article.schema';

export const articlesResponseSchema = Joi.object({
  articles: Joi.array().items(articleSchema).required(),
  articlesCount: Joi.number().integer().required(),
});
