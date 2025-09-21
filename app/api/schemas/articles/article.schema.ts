import Joi from 'joi';
import { authorSchema } from '../users/author.schema';

export const articleSchema = Joi.object({
  slug: Joi.string().required(),
  title: Joi.string().required(),
  description: Joi.string().required(),
  body: Joi.string().required(),
  createdAt: Joi.string().isoDate().required(),
  updatedAt: Joi.string().isoDate().required(),
  tagList: Joi.array().items(Joi.string()).required(),
  favorited: Joi.boolean().required(),
  favoritesCount: Joi.number().integer().required(),
  author: authorSchema.required(),
});
