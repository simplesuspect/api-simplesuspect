'use strict';
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const server = require('http').createServer(app);
const path = require('path');
const util = require('./utility.js');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));

app.post('/s', function (req, res) {
	var image = util.decodeBase64Image(req.body.data);
	res.status(200).send(image);
});

server.listen(3001, function () {
	console.log('Server listening at port %d', 3001);
});

