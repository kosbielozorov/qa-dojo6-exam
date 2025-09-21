import Joi from 'joi';
import { authorSchema } from '../users/author.schema';

export const commentResponseSchema = Joi.object({
  comment: Joi.object({
    id: Joi.string().required(),
    createdAt: Joi.string().isoDate().required(),
    author: authorSchema.required(),
  }).required(),
});
