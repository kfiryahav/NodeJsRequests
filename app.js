const express = require("express");
//know how to handle with diffrent routes
const path = require("path");
const http = require("http");

const mongodb = require("./db/mongoConnect");
const { routerInit } = require("./routes/config_routes");

// contain all the options and abilities of express
const app = express();
//defines all the information (POST/GET) will be in json format
app.use(express.json());
//defines that "public" folder be visible to the client
app.use(express.static(path.join(__dirname, "public")));

// solve the security problem of send payload from another domain
routerInit(app);

const server = http.createServer(app);

//defines the specific port of the server
const port = process.env.PORT || "3000";
server.listen(port);