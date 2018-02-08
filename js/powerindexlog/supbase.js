module.exports = (function() {
	var Nightmare = require('nightmare')
	require('nightmare-window-manager')(Nightmare)

	var showWindow = true
	var debug = true

	// App data
	var useragent = "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.116 Safari/537.36"
	var nightmare_opts = {
		show: true,
		waitTimeout: 10000,
		gotoTimeout: 5000,
		loadTimeout: 5000,
		typeInterval: 10,
		webPreferences: {
			partition: 'nopersist'
		}
	}

	var suploginurl = "http://www.supremacy1914.com/index.php?id=250&L=2"

	var nightmare = Nightmare(nightmare_opts)
	nightmare.useragent(useragent)

	function LoadMore() {
		return new Promise(function(resolve, reject) {
			if(debug) { console.log("[DEBUG] Loading more players") }
			nightmare
				.wait(200)
				.click('div[id=func_newspaper_ranking_show_all_button]')
				.then(function() {
					resolve()
				})
				.catch(function() {
					LoadMore()
				})
		})
	}

	function FetchDay() {
		return new Promise(function(resolve, reject) {
			if(debug) { console.log("[DEBUG] FetchDay") }
			nightmare
				.wait(200)
				.evaluate(function() {
					var data = []
					for (player of document.querySelectorAll('div#newspaper_ranking_single ol li')) {
						playerdata = []
						playerdata[0] = player.querySelector('div.autoResizeLine').innerHTML.trim()
						playerdata[1] = player.querySelector('div.ranking_points').innerHTML.trim()
						data.push(playerdata)
					}
					return data
				})
				.then(function(dayindex) {
					if(debug) { console.log("[DEBUG] Compairing outputs") }
					if (dayindex.length == indexdaysi[indexdays.length-1].length
						&& dayindex.every(function(u, i) {
							return u === arr2[i];
						})
					) {
						FetchDay()
					} else {
						if(debug) { console.log("[DEBUG] Arrays are not the same") }
						indexdays.push(dayindex)
						resolve()
					}
				}).catch(function() {
					if(debug) { console.log("[DEBUG] Catch") }
					FetchDay();
				})
		})
	}

	function LoopDays(totaldays) {
		return new Promise(function(resolve, reject) {
			console.log("Start looping days")
			indexdays = []
			RunNext(1, totaldays, indexdays)
			function RunNext(day, totaldays, indexdays) {
				if (day <= totaldays) {
					if(debug) { console.log("Getting power index of day: " +  day) }
					nightmare
						.type('input[id=func_newspaper_day_tf]')
						.type('input[id=func_newspaper_day_tf]', day)
						.then(function() {
							if(debug) { console.log("Load more") }
							LoadMore().then(function() {
								FetchDay().then(function() {
									nightmare
										.run(function() {
											RunNext(day+1, totaldays, indexdays)
										})
								})
							})
						})
				}
				else {
					resolve(indexdays)
				}
			}
		})
	}

	return {
		// Goto supremacy url, login with username and password from config
		Login: function (username, password) {
			return new Promise(function(resolve, reject) {
				if(debug) { console.log("[DEBUG] Handle login page: " + username) }
				nightmare
					.windowManager()
					.goto(suploginurl)
					.exists('form[id=sg_login_form]')
					.then(function(nologin) {
						if (nologin) {
							if(debug) { console.log("[DEBUG] Not logged in.") }
							nightmare
								.type('form[id=sg_login_form] [id=user]')
								.type('form[id=sg_login_form] [id=user]', username)
								.type('form[id=sg_login_form] [id=pass]', password)
								.click('form[id=sg_login_form] [type=submit]')
								.waitWindowLoad()
							if(debug) { console.log("[DEBUG] Filled in form.") }
						}
						else if(debug) { console.log("[DEBUG] Already logged in.") }
						nightmare
							.exists('form[id=sg_login_form]')
							.then(function(autherror) {
								if(autherror) {
									reject()
								}
								else {
									resolve()
								}
							})
					})
			})
		},
		// Open the game from the config and return the url
		GetGameUrl: function(vargameid) {
			return new Promise(function(resolve, reject) {
				if(debug) { console.log("[DEBUG] Getting URL from game: " + vargameid) }
				nightmare
					.type('input[id=sg_game_search_field]')
					.type('input[id=sg_game_search_field]', vargameid)
					.click('div[id=sg_game_search_arrow]')
					.wait(200)
					.click('tbody[id=sg_game_table_content] div[id*=test_game_] img[src*=guestlogin]')
					.waitWindowLoad()
					.currentWindow()
					.then(function(currentwindow) {
						var GameTitle = "Supremacy 1914 - " + vargameid.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.")
						if(currentwindow.title !== GameTitle) {
							console.log(GameTitle)
							console.log(currentwindow.title)
							if(debug) { console.log("[DEBUG] Wrong game") }
							reject()
						}
						else {
							if(debug) { console.log("[DEBUG] Loaded correct game") }
							nightmare
								.goto(currentwindow.url)
								.evaluate(function() {
									return document.getElementById("ifm").src
								})
								.then(function(gameurl) {
									console.log("Opening Game: " + vargameid)
									if(debug) { console.log("[DEBUG] Game Url:" +  gameurl) }
									resolve(gameurl)
								})
						}
					})
			})
		},
		GotoGame: function(gameurl) {
			return new Promise(function(resolve, reject) {
				nightmare
					.goto(gameurl)
					.waitWindowLoad()
					.wait(2500)
					.then(function() {
						if(debug) { console.log("[DEBUG] Game opened") }
						resolve()
					})
			})
		},
		OpenPaper: function() {
			return new Promise(function(resolve, reject) {
				nightmare
					.click('div[id=func_btn_newspaper]')
					.then(function() {
						if(debug) { console.log("[DEBUG] Paper opened") }
						resolve()
					})
					.catch(function(error) {
						if(debug) { console.log("[DEBUG] Error Opening paper") }
						reject()
					})
			})
		},
		FillPaper: function() {
			return new Promise(function(resolve, reject) {
				nightmare
					.wait(1000)
					.evaluate(function() {
						return document.querySelector('input#func_newspaper_day_tf').value
					})
					.then(function(totaldays) {
						if(debug) { console.log("[DEBUG] Total Days: " +  totaldays) }
						LoopDays(totaldays).then(function(response) {
							resolve(response)
						}, function(error) {
							console.log("[ERROR] Looging the days")
						})
					})
					.catch(function(error) {
						FillPaper()
					})
			})
		}
	}
})()
