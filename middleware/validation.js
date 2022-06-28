const Joi = require('joi');

 
const userSchema = Joi.object({
    name: Joi.string()
        .alphanum()
        .min(3)
        .max(30)
        .required(),
 
    password: Joi.string()
        .pattern(/^[a-zA-Z0-9]{3,30}$/),
 
    email: Joi.string()
            .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
    
    user_type: Joi.number()
        .integer()
       
 
})
module.exports = userSchema

