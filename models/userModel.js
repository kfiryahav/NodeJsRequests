const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require('jsonwebtoken');
const { config } = require("../config/secretData");

const userSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    age: Number,
    birth_date: String,
    email: String,
    password: String,
    business: Boolean,
    token: String
});

exports.UserModel = mongoose.model("User", userSchema, "users");

// create a new token for the user by his _id 
exports.getToken = (_userId) => {
    const token = jwt.sign({ _id: _userId }, config.jwtSecret, { expiresIn: "60mins" });
    return token;
};

exports.removeToken =

    exports.validUser = (_dataBody) => {
        const joiSchema = Joi.object({
            first_name: Joi.string().min(2).max(99).required(),
            last_name: Joi.string().min(2).max(99).required(),
            age: Joi.number().min(6).max(120).required(),
            business: Joi.boolean().required(),
            birth_date: Joi.string(),
            email: Joi.string().min(2).max(99).email().required(),
            password: Joi.string().min(2).max(99).required(),
            token: Joi.string()
        })
        return joiSchema.validate(_dataBody)
    }

// login validation with the help of joi module
exports.validLogin = (_dataBody) => {
    const joiSchema = Joi.object({
        email: Joi.string().min(2).max(99).email().required(),
        password: Joi.string().min(2).max(99).required()
    })

    return joiSchema.validate(_dataBody)
};