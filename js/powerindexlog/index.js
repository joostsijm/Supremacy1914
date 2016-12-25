// Requires
var fs = require('fs')
var supbase = require('./supbase')

// Settings
var debug = true
var showWindow = true

// Start Config File Imports
var configFile = require('./config')
var screenshotResult = configFile.screenshotResult
var screenshotFail = configFile.screenshotOnFailure
var username = configFile.username
var password = configFile.password
var gameid = configFile.gameid
// End Config File Imports

var screenshotFolder = "output/screenshots/"

// Prints nice little message
console.log("Supremacy1814 Power Index statics by Joost Sijm.")

// Settings check
if (gameid.length > 7) {
	console.log("[ERROR] length of game ID is too long to be valid.")
	console.log("Please use a valid game ID")
	process.exit()
}

// Helpers
function handleError(err) {
	if(debug) {
		console.log("[DEBUG] Error: " + JSON.stringify(err))
	}
	return err
}

start()

function start() {
	supbase.Login(username, password).then(function() {
		if(debug) { console.log("[DEBUG] Succesfull logged in.") }
		OpenGame()
	}, function(error) {
		console.log("[Error] Can't login")
	})
}

function OpenGame () {
	supbase.GetGameUrl(gameid).then(function(gameurl) {
		supbase.GotoGame(gameurl).then(function() {
			OpenPaper()
		}, function() {
			console.log("[ERROR] Opening Game")
		})
	}, function() {
		console.log("[ERROR] Getting url")
		OpenGame()
	})
}

function OpenPaper() {
	if(debug) { console.log("[DEBUG] Trying to open paper") }
	supbase.OpenPaper().then(function(response) {
		supbase.FillPaper().then(function(response) {
			processdays(response)
		}, function(error) {
			console.log("[ERROR] Looping paper")
		})
	}, function(error) {
		Console.log("[ERROR] Attempt to open paper")
		OpenPaper()
	})
}

function processdays(indexdays) {
	console.log("Exit Nightmare")
	var mixedDays = daymix(indexdays)
	writeLogFile(mixedDays)
}
function daymix(dayindex) {
	console.log('Processing days')
	output = []
	output[0] = []
	for(var i=0; i<dayindex.length; i++) {
		for(var p=0; p<dayindex[i].length; p++) {
			playerindex = output[0].indexOf(dayindex[i][p][0])
			playerindex++
			if(playerindex == '0') {
				lenght = output.length
				output[lenght] = []
				output[lenght].push(dayindex[i][p][0])
				output[lenght] = fillempty(output[lenght], i)
				output[lenght].push(dayindex[i][p][1])
				output[0].push(dayindex[i][p][0])
			}
			else {
				if(output[playerindex] == null) {
					if(debug) { console.log('[DEBUG] No player in output') }
				}
				else {
					output[playerindex] = fillempty(output[playerindex], i)
					output[playerindex].push(dayindex[i][p][1])
				}
			}
		}
	}
	output[playerindex] = fillempty(output[playerindex], i)
	return output
}
function fillempty(playerlog, lenght) {
	if(playerlog.length <= lenght) {
		for(var u=playerlog.lenght; u<=lenght; u++) {
			playerlog.push('')
		}
	}
	return playerlog
}
function writeLogFile(mixedDays) {
	fs.writeFile("./" + gameid + "output.csv", '', function(err) {
		if(err) {
			return console.log(err)
		}
		console.log("File cleared")
	})
	for(var i=1; i<mixedDays.length; i++) {
		mixedDays[i].push('\n')
		mixedDays[i][0] = '\"' + mixedDays[i][0] + '\"'
		fs.appendFile("./" + gameid + "output.csv", mixedDays[i], function(err) {
			if(err) {
				return console.log(err)
			}
		}) 
	}
	console.log("The file was saved!")
}
