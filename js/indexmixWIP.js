var responseExample = require('./responseExample');
var dayindex = responseExample.dayIndexExample;

console.log(daymix(dayindex));

function daymix(dayindex) {
	console.log('[DEBUG] Start daymix');
	output = [];
	output[0] = [];
	for(var i=0; i<dayindex.length; i++) {
		console.log('[DEBUG] Doing loop');
		for(var p=1; p<dayindex[i].length; p++) {
			console.dir(dayindex[i][p]);
			playerindex = output[0].indexOf(dayindex[i][p][0]);
			console.log('[DEBUG] Playerindex: ' + playerindex);
			if(playerindex == '-1') {
				lenght = output.length;
				output[lenght] = [];
				output[lenght].push(dayindex[i][p][0]);
				for(var o=1; o<i; o++) {
					output[lenght].push('');
				}
				output[lenght].push(dayindex[i][p][1]);
				output[0].push(dayindex[i][p][0]);
			}
			else {
				if(output[playerindex] == null) {
					console.log('[DEBUG] No player in output');
				}
				else {
					if(output[playerindex].length<= i) {
						for(var u =output[playerindex].length; u<=i; u++) {
							output[playerindex].push('');
						}
					}
					console.log('[DEBUG] Else, player: ' + dayindex[i][p][0]);
					console.log('[DEBUG] Else, index : ' + dayindex[i][p][1]);
					console.dir(output);
					output[playerindex].push(dayindex[i][p][1]);
				}
			}
		}
	}
	return output;
}
