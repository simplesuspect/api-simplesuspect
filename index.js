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

app.use(function (req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});
app.use(bodyParser.json({
	limit: '5mb'
}));
app.use(bodyParser.urlencoded({
	limit: '5mb'
}));

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
		//analyzesSmile: true,
		//analyzesFacialHair: true,
		//analyzesHeadPose: true
	});

	facePromise.then(function (response) {
		if (response == null || response.length === 0) {
			res.status(404).send("Face not found");
		}

		var faceId = response[0].faceId;

		var faceRectangle = response[0].faceRectangle;
		var faceAttributes = response[0].faceAttributes;

		var identifyPromise = faceClient.face.identify([faceId], "1", 1, 0.5);

		var emotionPromise = emotionClient.emotion.analyzeEmotion ({
			data: buffer,
			faceRectangles: [faceRectangle]
		});

		Promise.all([identifyPromise, emotionPromise]).then(function(responses) {
			var identityResponse = responses[0];
			var candidates = identityResponse[0].candidates;
			var personId = null;

			if (candidates.length > 0) {
				personId = candidates[0].personId;
			}

			faceClient.face.person.get("1", personId).then(function(person) {
				var data = {
					age: faceAttributes.age,
					gender: faceAttributes.gender,
					emotion: responses[1],
					person: person
				};
				res.status(200).send(data);
			});
		})
	});
});

server.listen(port, function () {
	console.log('Server listening at port %d', port);
});
