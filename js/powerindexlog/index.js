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
		.evaluateWindow(function(){
			return document.getElementById("ifm").src;
		})
		.then(function(gameurl){
			console.log("Opening Game: " + vargameid)
			if(debug) { console.log("Game Url:" +  gameurl); }
			var indexdays= [];
			gotogame(gameurl)
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
			.click('div[id=func_newspaper_ranking_show_all_button]')
			.wait(500)
			.evaluate(function() {
				var data = []
				for (player of document.querySelectorAll('div#newspaper_ranking_single ol li')) {
					playerdata = [];
					playerdata[0] = player.querySelector('div.autoResizeLine').innerHTML.trim()
					playerdata[1] = player.querySelector('div.ranking_points').innerHTML.trim()
					data.push(playerdata)
				}
				return data
			})
			.then(function(dayindex) {
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
	console.dir(indexdays);
	console.log("exit");
	nightmare
		.end()
		.then()
}
