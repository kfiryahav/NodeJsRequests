const jwt = require("jsonwebtoken");
const { config } = require("../config/secretData");
const { UserModel } = require("../models/userModel");

exports.authToken = (req, res, next) => {
    let validToken = req.header("x-auth-token");
    // const validToken = req.headers.authorization.split(' ')[1];
    if (!validToken) {
        return res.status(401).json({ msg: "You must have token" });
    }
    try {
        const decodeToken = jwt.verify(validToken, config.jwtSecret);
        // we add decodeToken to "req" so we aill be abale to use the information (id of the user) after we move to next function
        req.tokenData = decodeToken;

        next();
    }
    catch (err) {
        console.log(err);
        res.status(401).json({ err: "token invalid or expired" });
    }
};


// check if the client is a businesss
exports.checkIfBusiness = async (req, res, next) => {
    try {
        let user = await UserModel.findOne({ _id: req.tokenData._id, business: true });
        console.log(user);
        if (!user) {
            return res.status(401).json({ err: "User not biz" })
        }

        next();
    }
    catch (err) {
        console.log(err);
        res.status(401).json({ err: "there problem or user is not biz" });
    }
}