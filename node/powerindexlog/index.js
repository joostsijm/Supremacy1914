// Requires
var fs = require('fs');
var supbase = require('../supbase')

// Settings
var debug = true;
var showWindow = true;

// Start Config File Imports
var configFile = require('./config');
var screenshotResult = configFile.screenshotResult;
var screenshotFail = configFile.screenshotOnFailure;
var username = configFile.username;
var password = configFile.password;
var gameid = configFile.gameid;
// End Config File Imports

var screenshotFolder = "output/screenshots/";

// Prints nice little message
console.log("Supremacy1814 Power Index statics by Joost Sijm.");

// Settings check
if (gameid.length > 7) {
	console.log("Error: length of game ID is too long to be valid.");
	console.log("Please use a valid game ID");
	process.exit();
}

// Helpers
function handleError(err) {
	if(debug) {
		console.log("[DEBUG] Error: " + JSON.stringify(err));
	}
	return err;
}

supbase.Login(username, password).then(function(response) {
	console.log(response);

	supbase.GetGameUrl(gameid).then(function(gameurl) {
		console.log(response);
		supbase.GotoGame(gameurl).then(function(response) {
			console.log("[DEBUG] Trying to open paper");
			supbase.OpenPaper().then(function(response) {
				supbase.FillPaper();
			}, function(error) {
				Console.log("Error opening newpaper");
			});
		}, function(error) {
			console.log("Error opening Game");
		});
	}, function(error) {
		console.log("Error getting url");
	});
}, function(error) {
	console.log("Failed");
});

function processdays(indexdays) {
	console.log("Exit Nightmare");
	nightmare
		.end()
		.then()
	var mixedDays = daymix(indexdays)
	writeLogFile(mixedDays)
}
function daymix(dayindex) {
	console.log('Processing days');
	output = [];
	output[0] = [];
	for(var i=0; i<dayindex.length; i++) {
		for(var p=1; p<dayindex[i].length; p++) {
			playerindex = output[0].indexOf(dayindex[i][p][0]);
			playerindex++;
			if(playerindex == '0') {
				lenght = output.length;
				output[lenght] = [];
				output[lenght].push(dayindex[i][p][0]);
				output[lenght] = fillempty(output[lenght], i);
				output[lenght].push(dayindex[i][p][1]);
				output[0].push(dayindex[i][p][0]);
			}
			else {
				if(output[playerindex] == null) {
					console.log('[DEBUG] No player in output');
				}
				else {
					output[playerindex] = fillempty(output[playerindex], i);
					output[playerindex].push(dayindex[i][p][1]);
				}
			}
		}
	}
	output[playerindex] = fillempty(output[playerindex], i);
	return output;
}
function fillempty(playerlog, lenght) {
	if(playerlog.length <= lenght) {
		for(var u=playerlog.lenght; u<=lenght; u++) {
			playerlog.push('');
		}
	}
	return playerlog;
}
function writeLogFile(mixedDays) {
	fs.writeFile("./output.csv", '', function(err) {
		if(err) {
			return console.log(err);
		}
		console.log("File cleared");
	});
	for(var i=1; i<mixedDays.length; i++) {
		mixedDays[i].push('\n');
		mixedDays[i][0] = '\"' + mixedDays[i][0] + '\"';
		fs.appendFile("./output.csv", mixedDays[i], function(err) {
			if(err) {
				return console.log(err);
			}
		}); 
	}
	console.log("The file was saved!");
}
