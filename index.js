var express = require('express')
var bodyParser = require('body-parser')
var util = require('util');
var _ = require('underscore');
var request = require('request');

require('dotenv').load();

// Simple way of having nice logs
function log(message) {
	var prefix = (new Date).toISOString();

	if(typeof message === 'object') {
		console.log(prefix + " ▼");
		console.log(util.inspect(message, {showHidden: false, depth: 10}));
	} else {
		console.log(prefix + " -> " + message);
	}
}

function MemorySaveAnswers(token, answers, form_id) {
	log("Adding answers for token: " + token + " and id: " + form_id);
	if(this.answersExists(form_id)) {
		var old_answers = this.storage[form_id].answers;
		var new_answers = old_answers.concat(answers)
		this.storage[form_id].answers = new_answers;
	} else {
		this.storage[form_id] = {answers: answers, token: token};
	}
}
function MemoryGetAnswers(form_id) {
	log("Getting answers for form_id: " + form_id);
	if(this.answersExists(form_id)) {
		return this.storage[form_id];
	} else {
		return null;
	}
}
function MemoryAnswersExists(form_id) {
	return this.storage[form_id] !== undefined;
}

var persistence = {
	storage: {},
	saveAnswers: MemorySaveAnswers,
	getAnswers: MemoryGetAnswers,
	answersExists: MemoryAnswersExists
}

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));


app.get('/alive', function handleAlive(req, res) {
  res.send('yes');
});

app.post('/receive_command', function handleReceiveCommand(req, res) {
	var form = createFormFromString(req.body.text, function(err, response, body) {
		if(err !== null) {
			throw err
		}
		log(body)
		log(body.links.form_render.get)
		res.send('Ok!');
	});
});

app.post('/receive_results', function handleReceiveResults(req, res) {
	log('Got results!');
	log(req.body);
	var body = req.body;
	saveAnswers(body.token, body.answers, body.id);
	res.send('All right...');
});

app.post('/forms', function handleForms(req, res) {
	var body = req.body;
	createFormFromJSON(req.body, function(err, response, form) {
		if(err !== null) {
			throw err
		}
		res.send(form);
	});
});

app.get('/results/:form_id', function handleResultsWithToken(req, res) {
	var results = persistence.getAnswers(req.params.form_id);
	if(results) {
		res.send(JSON.stringify(results));
	} else {
		res.sendStatus(404);
	}
});

app.use('/reports', express.static('web'));

app.get('/reports/:form_id', function(req, res) {
	res.sendFile(__dirname + '/web/index.html');
});

var port = process.env.PORT || 5000;

var server = app.listen(port, function () {
  var host = server.address().address;
  var port = server.address().port;
  log('Example app listening at http://'+host+':'+port);
});


function announceFormInChat() {}

function announceAnswerInChat() {}

function saveAnswers(token, answers, form_id) {
	persistence.saveAnswers(token, answers, form_id)
}

function createFormFromString(text, callback) {
	var unformatted_question = text.split('~');
	var form = {
		title: process.env.FORM_TITLE,
		webhook_submit_url: process.env.FORM_WEBHOOK,
		fields: []
	};
	_.forEach(unformatted_question, function(question) {
		var splitted = question.split('|');
		var type = splitted[0].trim();
		var text = splitted[1].trim();
		form.fields.push({
			type: type,
			question: text
		});
	});
	createTypeform(form, function(err, res, body) {
		callback(err, res, body);
	});
}

function createFormFromJSON(json, callback) {
	createTypeform(json, function(err, res, body) {
		callback(err, res, body);
	});
}

function createTypeform(form, callback) {
	var url = process.env.API_ENDPOINT;

	var options = {
		json: form,
		headers: {
			'X-API-TOKEN': process.env.API_TOKEN,
			'Content-Type': 'application/json; charset=utf-8',
		}
	};

	var requestCallback = function createFormCallback(error, response, body) {
		callback(error, response, body);
	};

	request.post(url, options, requestCallback);
}
