import Joi from 'joi';

export const authorSchema = Joi.object({
  username: Joi.string().required(),
  image: Joi.string().uri().required(),
  following: Joi.boolean().required(),
});
