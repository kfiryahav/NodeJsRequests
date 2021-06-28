const express = require('express');
const { pick } = require('lodash');
const router = express.Router();
const { authToken, checkIfBusiness } = require("../middlewares/auth");
const { PostModel, validPost, genPostnumber } = require("../models/postModel");


router.get('/', (req, res) => {
    res.json('welcome to  post rouer!');
});

router.post("/", authToken, checkIfBusiness, async (req, res) => {
    let validBody = validPost(req.body);
    if (validBody.error) {
        return res.status(400).json(validBody.error.details);
    }
    try {
        // at first check if the user have token 
        // second - checks if this user is a business user
        // and than add new post from the detiles of the req.body
        let post = new PostModel(req.body);
        // post.name = req.tokenData.first_name;
        //   when you add a new post it adds new property with id of the user (user_id)
        post.author_id = req.tokenData._id;
        await post.save();
        res.status(201).send(post);
        // res.status(201).json(pick(post, ["title", "body", "author_id"]));
    }
    catch (err) {
        console.log(err);
        res.status(400).json(err);
    }
});

router.put("/:idEdit", authToken, async (req, res) => {
    let idEdit = req.params.idEdit
    let validBody = validPost(req.body);
    if (validBody.error) {
        return res.status(400).json(validBody.error.details);
    }
    try {
        // can edit only if the id of the user is equal to the id that sended with the token
        let data = await PostModel.updateOne(req.body);
        // if success we will get: "n1";
        res.json(data);
    }
    catch (err) {
        console.log(err);
        res.status(400).json(err);
    }
});

router.delete("/:idDel", authToken, async (req, res) => {
    let idDel = req.params.idDel;
    try {
        let data = await PostModel.deleteOne({ _id: idDel });
        // if success we will get: "n1";
        res.json(data);
    }
    catch (err) {
        console.log(err);
        res.status(400).json(err);
    }
});

router.get("/totalPosts", async (req, res) => {
    try {
        let data = await PostModel.find({}).select('author_id title body -_id').populate("author_id", "first_name last_name -_id");
        res.json({ posts: data });
    }
    catch (err) {
        console.log(err)
        res.status(400).json(err)
    }
});

router.get("/:idGet", async (req, res) => {
    let idGet = req.params.idGet;
    try {
        let data = await PostModel.find({ _id: idGet }).select('author_id title body -_id').populate("author_id");
        res.json(data);
    } catch (error) {
        console.log(err)
        res.status(400).json(err)
    }
});

router.get("/:idDel", async (req, res) => {
    let idDel = req.params.idDel;
    try {
        let data = await PostModel.deleteOne({ _id: idDel });
        res.json(data);
    } catch (error) {
        console.log(err)
        res.status(400).json(err)
    }
});

module.exports = router;