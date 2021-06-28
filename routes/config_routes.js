const indexR = require("./index");
const userR = require("./users");
const postR = require("./posts");

exports.routerInit = (app) => {
    app.use("/", indexR);
    app.use("/users", userR);
    app.use("/posts", postR);

    app.use((req, res) => {
        res.json({ msg: "Url not found , page 404 " })
    })
};

