var fs = require('fs');
var responseExample = require('./responseExampleLong');
var dayindex = responseExample.dayIndexExample;
var mixedDays = daymix(dayindex)
console.log(mixedDays);
writeLogFile(mixedDays);

function daymix(dayindex) {
	console.log('[DEBUG] Start daymix');
	output = [];
	output[0] = [];
	for(var i=0; i<dayindex.length; i++) {
		console.log('[DEBUG] Doing loop');
		for(var p=1; p<dayindex[i].length; p++) {
			console.dir(dayindex[i][p]);
			playerindex = output[0].indexOf(dayindex[i][p][0]);
			playerindex++;
			console.log('[DEBUG] Playerindex: ' + playerindex);
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
					console.log('[DEBUG] Else, player: ' + dayindex[i][p][0]);
					console.log('[DEBUG] Else, index : ' + dayindex[i][p][1]);
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
