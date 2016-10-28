// Requires
var Nightmare = require('nightmare')
require('nightmare-window-manager')(Nightmare);
var fs = require('fs');
var request = require('request');

// Settings
var debug = false;
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
			return CheckIndex(gameid);
		});
}
function CheckIndex(vargameid) {
	if(debug) { console.log("[DEBUG] Opening the game: " + vargameid); }
	nightmare
		.type('input[id=sg_game_search_field]', vargameid)
		.click('div[id=sg_game_search_arrow]')
		.wait(1200)
		.click('tbody[id=sg_game_table_content] div[id*=test_game_] img[src*=guestlogin]')
		.then(function(windowvar){
			console.log("Opening Game: " + vargameid)
			if(debug) { console.dir(windowvar); }
		});
}
