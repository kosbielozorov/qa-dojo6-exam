import Joi from 'joi';

export const tagsResponseSchema = Joi.object({
  tags: Joi.array().items(Joi.string().required()).required(),
});
