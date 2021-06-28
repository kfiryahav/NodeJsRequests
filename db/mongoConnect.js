// getting-started.js
const mongoose = require('mongoose');
mongoose.connect('here you should enter your DB', { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log("mongo connected");
});

module.exports = db;
