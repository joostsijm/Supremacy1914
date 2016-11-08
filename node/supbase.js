// tools.js
// ========
module.exports = (function() {
	var Nightmare = require('nightmare')
	require('nightmare-window-manager')(Nightmare);

	var showWindow = true;
	var debug = true;

	// App data
	var useragent = "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.116 Safari/537.36";
	var nightmare_opts = {
		show: showWindow,
		waitTimeout: 10000,
		gotoTimeout: 5000,
		loadTimeout: 5000,
	};

	var suploginurl = "http://www.supremacy1914.com/index.php?id=250&L=2";

	var nightmare = Nightmare(nightmare_opts);
	nightmare.useragent(useragent);

	function LoopDays(totaldays) {
		return new Promise(function(resolve, reject) {
			console.log("Start looping days")
			indexdays = [];
			RunNext(1, totaldays, indexdays);
			function RunNext(day, totaldays, indexdays) {
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
							indexdays.push(dayindex)
						});
					nightmare
						.wait(1500)
						.run(function() {
							RunNext(day+1, totaldays, indexdays);
						});
				}
				else {
					resolve(indexdays);
				}
			}
		});
	}

	return {
		Login: function (username, password) {
			return new Promise(function(resolve, reject) {
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
							if(debug) { console.log("[DEBUG] Filled in form."); }
						}
						else if(debug) { console.log("[DEBUG] Already logged in.") }
						resolve("Authorization succesfull.");
					});
			});
		},
		GetGameUrl: function(vargameid) {
			return new Promise(function(resolve, reject) {
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
								if(debug) { console.log("[DEBUG] Game Url:" +  gameurl); }
								var indexdays= [];
								resolve(gameurl)
							});
					});
			});
		},
		GotoGame: function(gameurl) {
			return new Promise(function(resolve, reject) {
				nightmare
					.goto(gameurl)
					.waitWindowLoad()
					.wait(2500)
					.then(function() {
						if(debug) { console.log("[DEBUG] Game opened"); }
						resolve("Game opened");
					});
			});
		},
		OpenPaper: function() {
			console.log("[DEBUG] Opening Paper")
			return new Promise(function(resolve, reject) {
				nightmare
					.wait(500)
					.click('div[id=func_btn_newspaper]')
					.then(function() {
						resolve("Succes");
					})
					.catch(function(error) {
						reject("Error");
					});
			});
		},
		FillPaper: function() {
			return new Promise(function(resolve, reject) {
				nightmare
					.wait(2000)
					.evaluate(function() {
						return document.querySelector('input#func_newspaper_day_tf').value;
					})
					.then(function(totaldays) {
						if(debug) { console.log("Total Days:" +  totaldays); }
						LoopDays(totaldays).then(function(response) {
							resolve(response)
						}, function(error) {
							console.log("Error!")
						})
					})
					.catch(function(error) {
						handleError(error);
						FillPaper();
					});
			});
		}
	}
})();
