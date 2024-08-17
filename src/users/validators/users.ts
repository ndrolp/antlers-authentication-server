import Joi from 'joi'

export const createUserValidation = Joi.object({
    username: Joi.string().required(),
    email: Joi.string().email().required(),
    name: Joi.string().required(),
    lastName: Joi.string(),
    password: Joi.string().min(8).required(),
})
