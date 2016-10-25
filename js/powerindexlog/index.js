// Requires
var Nightmare = require('nightmare');
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
	loadTimeout: 5000
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

// function handleError(err) {
// 	if(debug) {
// 		console.log("[DEBUG] Error: " + JSON.stringify(err));
// 	}
// 	return err;
// }

// function Login() {
// 	if(debug) {
// 		console.log("[DEBUG] Handle login page: " + username);
// 	}
// 	nightmare
// 		.goto(suploginurl)
// 		.wait(2000)
// 		.type('form[id="sg_login_form"] [id=user]', username)
// 		.type('form[id="sg_login_form"] [id=pass]', password)
// 		.click('form[id="sg_login_form"] [type=submit]')
// 		.wait(1000);
// }
function Login() {
	if(debug) {
		console.log("[DEBUG] Handle login page: " + username);
	}
	nightmare
		.goto(suploginurl)
		.exists('form[id=sg_login_form]')
		.then(function(nologin) {
			if (nologin) {
				console.log("[Debug] Nog logged in.")
				nightmare
					.type('form[id=sg_login_form] [id=user]', username)
					.type('form[id=sg_login_form] [id=pass]', password)
					.click('form[id=sg_login_form] [type=submit]')
					.then(function(r){});
				console.log("[Debug] Naam inguvuld");
			}
			else { console.log("[Debug] Already logged in.") }
			return CheckIndex(gameid);
		});
	//	console.log(nightmare.type('form[id="sg_login_form"]'));
	//	console.log(nightmare.type('form[id="sg_logout"]'));
	//	if (nightmare.type('form[id="sg_login_form"]')) {
}

// First page
function CheckIndex(vargameid) {
	if(debug) {
		console.log("[DEBUG] Opening the game: " + vargameid);
	}
	nightmare
		.type('input[id=sg_game_search_field]', vargameid)
		.click('div[id=sg_game_search_arrow]')
		.wait(500)
		.click('tbody[id=sg_game_table_content] div[id*=test_game_] img[src*=guestlogin]')
//		.wait(5000)
//		.click('div[id=func_btn_newspaper]')
		.then(function(r){})
//		.then(function(validated)  {
//			console.log(validated);
//			if(!validated) {
//				console.log("[" + vargameid + "] Servers are acting up... Trying again.");
//				return function() { nightmare.wait(500).refresh().wait(); opengame(ctr); };
//			} else {
//				return function() { fillFirstPage(ctr); };
//			}
//		})
//		.then(function(next) {
//			 Handle next step: either a loop to first page in case of error, or form fill on success
//		return next();
//			})
// 	.catch(handleError)
//		.then(function(err) {
//			if (typeof err !== "undefined") {
//				return opengame(ctr);
//			}
//		});
}

function fillFirstPage(ctr) {
	if(debug) {
		console.log("[DEBUG] Fill first page #" + ctr);
	}

	nightmare.evaluate(function(data) {
		var dob = new Date((new Date()).getTime() - (Math.random() * (new Date()).getTime()) - 18*365*24*60*60*1000 );
		document.getElementById("id_dob").value = dob.getFullYear() + "-" + (dob.getMonth()+1) + "-" + dob.getDate();

		var els = document.getElementsByName("country");
		for(var i = 0; i < els.length; i++) {
			els[i].value = data.country;
		}

		return document.getElementById("id_dob").value;
	}, { country: country })
		.click("form[name='verify-age'] [type=submit]")
		.wait("#id_username")
		.then(function() {
			handleSignupPage(ctr);
		})
		.catch(handleError)
		.then(function(err) {
			if (typeof err !== "undefined") {
				return opengame(ctr);
			}
		});
}

// Signup page
function handleSignupPage(ctr) {
	if(debug) {
		console.log("[DEBUG] Handle second page #" + ctr);
	}

	nightmare.evaluate(evaluateSignupPage)
		.then(function(validated) {
			if(!validated) {
				// Missing form data, loop over itself
				console.log("[" + ctr + "] Servers are acting up... Trying again.");
				return function() { nightmare.wait(500).refresh().wait(); opengame(ctr); };
			} else {
				return function() { fillSignupPage(ctr); };
			}
		}).then(function(next) {
			// Handle next step: either a loop to first page in case of error, or form fill on success
			return next();
		})
		.catch(handleError)
		.then(function(err) {
			if (typeof err !== "undefined") {
				return handleSignupPage(ctr);
			}
		});
}

function fillSignupPage(ctr) {
	if(debug) {
		console.log("[DEBUG] Fill signup page #" + ctr);
	}

	var _pass = password;
	// var _nick = username + ctr;

	if(useRandomPassword) {
		_pass = randomPassword();
	}

	// Use nicknames list, or (username + number) combo?
	if(useNicknamesFile) {
		// Make sure we have a nickname left
		if(nicknames.length < 1) {
			throw Error("We're out of nicknames to use!");
		}

		// Get the first nickname off the list & use it
		_nick = nicknames.shift();
	}

	// Fill it all in
	nightmare.evaluate(function(data) {
		document.getElementById("id_password").value = data.pass;
		document.getElementById("id_confirm_password").value = data.pass;
		document.getElementById("id_email").value = data.email_user === "" ? data.nick + "@" + data.email_domain : data.email_user + "+" + data.nick + "@" + data.email_domain;
		document.getElementById("id_confirm_email").value = data.email_user === "" ? data.nick + "@" + data.email_domain : data.email_user + "+" + data.nick + "@" + data.email_domain;
		document.getElementById("id_screen_name").value = data.nick;
		document.getElementById("id_username").value = data.nick;
		window.scrollTo(0,document.body.scrollHeight);
	}, { "pass": _pass, "nick": _nick, "email_user": email_user, "email_domain": email_domain })
		.check("#id_terms")
		.wait(function() {
			return (document.getElementById("signup-signin") !== null || document.getElementById("btn-reset") !== null || document.body.textContent.indexOf("That username already exists") > -1);
		})
		.evaluate(function() {
			return (document.body.textContent.indexOf("Hello! Thank you for creating an account!") > -1);
		})
		.then(function(success) {
			if(success) {
				// Log it in the file of used nicknames
				var content = outputFormat.replace('%NICK%', _nick).replace('%PASS%', _pass).replace('%LAT%', lat).replace('%LON%', lon).replace('%UN%', _nick);
				fs.appendFile(outputFile, content, function(err) {
					//
				});
			}

			if((success && screenshotResult) || screenshotFail) {
				// Screenshot
				nightmare.screenshot(screenshotFolder + _nick + ".png");
			}

			// Next one, or stop
			if(ctr < end) {
				return function() { createAccount(ctr + 1); };
			} else {
				return nightmare.end();
			}
		}).then(function(next) {
			return next();
		}).catch(handleError)
		.then(function(err) {
			if (typeof err !== "undefined") {
				return handleSignupPage(ctr);
			}
		});
}

// Evaluations
function evaluateDobPage() {
	var dob_value = document.getElementById("id_dob");
	return ((document.title === "The Official Pokémon Website | Pokemon.com") && (dob_value !== null));
}

function evaluateSignupPage() {
	var username_field = document.getElementById("id_username");
	return ((document.title === "The Official Pokémon Website | Pokemon.com") && (username_field !== null));
}
