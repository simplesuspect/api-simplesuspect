'use strict';
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const server = require('http').createServer(app);
const path = require('path');

const key = "5a7bc1aa7775473dbc2a587a623682d5";
const oxford = require('project-oxford');
const client = new oxford.Client(key, 'https://westus.api.cognitive.microsoft.com');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));


app.post('/s', function (req, res) {
	client.face.detect({
		data: oxford.makeBuffer(req.body.data),
		returnFaceId: true,
		analyzesAge: true,
		analyzesGender: true,
		analyzesFaceLandmarks: true,
		analyzesSmile: true,
		analyzesFacialHair: true,
		analyzesHeadPose: true
	}).then(function (response) {
		console.log(response);
		
		res.status(200).send(response);
	});
});

server.listen(3001, function () {
	console.log('Server listening at port %d', 3001);
});
