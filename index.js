'use strict';
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const server = require('http').createServer(app);
const path = require('path');
app.use(bodyParser.json());



app.get('/suspect', function (req, res) {
	res.status(200).send('you are guilty');
});


server.listen(3000, function () {
	console.log('Server listening at port %d', 3000);
});
