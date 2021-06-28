const express = require('express');
const router = express.Router();
const bcrypt = require("bcrypt");
const { pick } = require("lodash");
const { UserModel, getToken, validLogin, validUser } = require('../models/userModel');
const { authToken } = require("../middlewares/auth");

router.get('/', (req, res) => {
    res.json('welcome to user rouer!');
});

router.get("/logout", authToken, async (req, res) => {
    const user = await UserModel.findById(req.tokenData._id);
    user.token = null
    user.save()
    console.log(res.header)
    return res.send("you have been logged out!");
});

router.post("/login", async (req, res) => {
    const validBody = validLogin(req.body);
    if (validBody.error) {
        return res.status(400).json(validBody.error.details);
    }
    try {
        // checks if there is a user with this email
        console.log(UserModel)
        const user = await UserModel.findOne({ email: req.body.email });
        if (!user) {
            // returns an error message if email not found
            return res.status(401).json("User or password not found 1");
        }
        // console.log(user)
        // checks if the password is valid
        const validPass = await bcrypt.compare(req.body.password, user.password);
        if (!validPass) {
            return res.status(401).json("User or password not found 2");
        }
        // finally create a new unique token for the user by his _id
        const newToken = getToken(user._id)
        user.token = newToken;
        user.save();
        res.json({ token: newToken });
        console.log(user)
    }
    catch (err) {
        console.log(err)
        res.status(400).json(err)
    }
})

// create new user
router.post("/", async (req, res) => {
    const validBody = validUser(req.body);
    console.log(validBody);
    if (validBody.error) {
        return res.status(400).json(validBody.error.details);
    }
    try {
        const user = new UserModel(req.body);
        console.log(user);
        // Encrypting the password
        user.password = await bcrypt.hash(user.password, 10);

        await user.save();
        // for sequrity reasons it returns the detailes without the password
        res.status(201).json(pick(user, ["first_name", "last_name", "age", "_id", "birth_date"]));
        console.log(user)
    }
    catch (err) {
        if (err.code == 11000) {
            return res.status(400).json({ err: "User/Email already in system! try to log in", code: 11000 })
        }
        console.log(err)
        res.status(400).json(err)
    }
});

module.exports = router;