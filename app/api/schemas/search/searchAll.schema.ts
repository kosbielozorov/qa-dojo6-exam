import Joi from 'joi';
import { articleSchema } from '../articles/article.schema';

export const searchArticlesResponseSchema = Joi.object({
  articles: Joi.array().items(articleSchema).required(),
  articlesCount: Joi.number().integer().required(),
});
