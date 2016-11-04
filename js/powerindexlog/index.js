// Requires
var Nightmare = require('nightmare')
require('nightmare-window-manager')(Nightmare);
var fs = require('fs');
var request = require('request');

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

var outputFile = "output/output.csv"; // File which will contain the generated "username password" combinations.
var outputFormat = "%NAME%,%INDEXDATA%"; // Format used to save the account data in outputFile. Supports %NICK%, %PASS%.
var screenshotFolder = "output/screenshots/";

// App data
var suploginurl = "http://www.supremacy1914.com/index.php?id=250&L=2";
var useragent = "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.116 Safari/537.36";
var nightmare_opts = {
	show: showWindow,
	waitTimeout: 10000,
	gotoTimeout: 5000,
	loadTimeout: 5000,
	'web-preferences': {'web-security': false}
};
// Prints nice little message
console.log("Supremacy1814 Power Index statics by Joost Sijm");


// Settings check
if (gameid.length > 7) {
	console.log("Error: length of game ID is too long to be valid.");
	console.log("Please use a valid game ID");
	process.exit();
}

// LETSAHGO
var nightmare = Nightmare(nightmare_opts);
nightmare.useragent(useragent);

Login();

// Helpers

function handleError(err) {
	if(debug) {
		console.log("[DEBUG] Error: " + JSON.stringify(err));
	}
	return err;
}

function Login() {
	if(debug) { console.log("[DEBUG] Handle login page: " + username); }
	nightmare
		.windowManager()
		.goto(suploginurl)
		.exists('form[id=sg_login_form]')
		.then(function(nologin) {
			if (nologin) {
				if(debug) { console.log("[DEBUG] Not logged in.") }
				nightmare
					.type('form[id=sg_login_form] [id=user]', username)
					.type('form[id=sg_login_form] [id=pass]', password)
					.click('form[id=sg_login_form] [type=submit]')
					.waitWindowLoad()
				if(debug) { console.log("[DEBUG] Filled in name"); }
			}
			else if(debug) { console.log("[DEBUG] Already logged in.") }
			getgameurl(gameid);
			nightmare
				.current
		});
}
function getgameurl(vargameid) {
	if(debug) { console.log("[DEBUG] Opening the game: " + vargameid); }
	nightmare
		.type('input[id=sg_game_search_field]', vargameid)
		.click('div[id=sg_game_search_arrow]')
		.wait(1200)
		.click('tbody[id=sg_game_table_content] div[id*=test_game_] img[src*=guestlogin]')
		.waitWindowLoad()
		.currentWindow()
		.then(function(currentwindow){
			nightmare
				.goto(currentwindow.url)
				.evaluate(function() {
					return document.getElementById("ifm").src;
				})
				.then(function(gameurl) {
					console.log("Opening Game: " + vargameid)
					if(debug) { console.log("Game Url:" +  gameurl); }
					var indexdays= [];
					gotogame(gameurl)
				})
		})
}
function gotogame(gameurl) {
	nightmare
		.goto(gameurl)
		.waitWindowLoad()
		.then(function() {
			OpenPaper()
		})
}
function OpenPaper() {
	nightmare
		.wait(2500)
		.click('div[id=func_btn_newspaper]')
		.then(function() {
			FillPaper();
		})
		.catch(function(error) {
			handleError(error);
			OpenPaper();
		})
}
function FillPaper() {
	nightmare
		.wait(2000)
		.evaluate(function() {
			return document.querySelector('input#func_newspaper_day_tf').value;
		})
		.then(function(totaldays) {
			if(debug) { console.log("Total Days:" +  totaldays); }
			indexdays = [];
			RunNext(1, totaldays, indexdays);
		})
		.catch(function(error) {
			handleError(error);
			FillPaper();
		})
}
function RunNext (day, totaldays, indexdays) {
	if (day <= totaldays) {
		if(debug) { console.log("Getting power index of day: " +  day); }
		nightmare
			.evaluate(function() {
				document.querySelector('input#func_newspaper_day_tf').value = ''
			})
			.type('input[id=func_newspaper_day_tf]', day)
			.wait(500)
			.click('li[id=func_tab_newspaper_ranking_team]')
			.wait(500)
			.evaluate(function() {
				var data = []
				for (player of document.querySelectorAll('div#newspaper_ranking_team ol li')) {
					playerdata = [];
					for (var i = 0; i < player.childNodes.length; i++) {
						var curNode = player.childNodes[i];
						whitespace = /^\s*$/;
						console.log(curNode.nodeName,curNode.nodeType,whitespace.test(curNode.nodeValue));
						if (curNode.nodeName === "#text" && !(whitespace.test(curNode.nodeValue))) {
							playerdata[0] = curNode.nodeValue.trim();
							break;
						}
					}
					playerdata[1] = player.querySelector('div.ranking_points').innerHTML.trim()
					data.push(playerdata)
				}
				return data
			})
			.then(function(dayindex) {
				console.log("Getting coalition")
				console.dir(dayindex);
				indexdays.push(dayindex)
			});
		nightmare
			.wait(1500)
			.run(function() {
				RunNext(day+1, totaldays, indexdays);
			});
	}
	else {
		processdays(indexdays)
	}
}

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
		for(var p=0; p<dayindex[i].length; p++) {
			playerindex = output[0].indexOf(dayindex[i][p][0]);
			playerindex++;
			if(playerindex == '0') {
				lenght = output.length;
				playerlog = [];
				playerlog.push(dayindex[i][p][0]);
				playerlog = fillempty(playerlog, i);
				console.dir(playerlog)
				playerlog.push(dayindex[i][p][1]);
				output[lenght] = playerlog;
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
	return output;
}
function fillempty(playerlog, length) {
	console.log('[DEBUG] Fill empty')
	if(playerlog.length <= length) {
		console.log("playerlog length: " + playerlog.length)
		console.log("[DEBUG] playerlog <= lenght")
		for(var k=playerlog.length; k<=length; k++) {
			playerlog.push('0');
			console.log("push empty")
		}
	}
	else {
		console.log("[DEBUG]   lenght <= playerlog ")
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
