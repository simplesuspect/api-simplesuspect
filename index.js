'use strict';
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const server = require('http').createServer(app);
const path = require('path');

const faceKey = "5a7bc1aa7775473dbc2a587a623682d5";
const emotionKey = "0bff0c825fb84444bb8ca71458b5dd34";
const oxford = require('project-oxford');
const faceClient = new oxford.Client(faceKey, 'https://westus.api.cognitive.microsoft.com');
const emotionClient = new oxford.Client(emotionKey, 'https://westus.api.cognitive.microsoft.com');
const port = process.env.PORT || 8080;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));

app.post('/s', function (req, res) {
	var buffer = oxford.makeBuffer(req.body.data);

	var facePromise = faceClient.face.detect({
		data: buffer,
		returnFaceId: true,
		analyzesAge: true,
		analyzesGender: true,
		//analyzesFaceLandmarks: true,
		analyzesSmile: true,
		analyzesFacialHair: true,
		analyzesHeadPose: true
	});

	facePromise.then(function(response){
		var faceId = response[0].faceId;

		var identifyPromise = faceClient.face.identify([faceId], "1", 1, 0.5);

		var emotionPromise = emotionClient.emotion.analyzeEmotion ({
			data: buffer
		});

		Promise.all([identifyPromise, emotionPromise]).then(function(responses) {
			res.status(200).send(responses);
		})
	});
});

server.listen(port, function () {
	console.log('Server listening at port %d', port);
});
