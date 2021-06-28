const mongoose = require("mongoose");
const Joi = require("joi");
const userModel = require("../models/userModel");

const postSchema = new mongoose.Schema({
    title: String,
    body: String,
    create_date: {
        type: Date, default: Date.now()
    },
    author_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: String
});

exports.PostModel = mongoose.model("Post", postSchema, "posts");

exports.validPost = (_dataBody) => {
    let joiSchema = Joi.object({
        title: Joi.string().min(2).max(99).required(),
        body: Joi.string().min(2).max(500).required(),
        author_id: Joi.string(),
        name: Joi.string().min(2).max(99)
    })

    return joiSchema.validate(_dataBody)
};