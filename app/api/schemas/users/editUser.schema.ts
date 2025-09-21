import Joi from 'joi';

export const editUserResponseSchema = Joi.object({
  user: Joi.object({
    username: Joi.string().required(),
    email: Joi.string().email().required(),
    token: Joi.string().required(),
    image: Joi.string().uri().optional(),
    bio: Joi.string().optional(),
  }).required(),
});
