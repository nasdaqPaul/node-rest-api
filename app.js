const express = require('express')
const app = express();
const api = require('./api');
const {connect} = require('./db');
const config = require('config');


app.use('/api', api);

module.exports = app

// app.listen(3000, async function () {
//     await connect(config.get('dbConfig'));
// })