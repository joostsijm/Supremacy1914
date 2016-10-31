var dayindex = 
[
	[ 
		[ 'Italië', '199'  ],
		[ 'Japanse rijk', '184'  ],
		[ 'Frans Algerije', '171'  ],
		[ 'Zweden', '134'  ],
		[ 'Het Koninkrijk Engeland', '109'  ],
		[ 'Arabië', '105'  ],
		[ 'Duits Tanzania', '101'  ],
		[ 'Verenigde Staten van Amerika', '88'  ],
		[ 'Papoea Nieuw-Guinese', '82'  ],
		[ 'Chili', '67'  ],
		[ 'Republiek van Australië', '66'  ],
		[ 'Duits Kameroen', '65'  ],
		[ 'Nederlands Oost-Indië', '51'  ],
		[ 'Brits Canada', '49'  ],
		[ 'Brits Egypte', '47'  ],
		[ 'Canada', '45'  ]
	],
	[ 
		[ 'Peru', '20'  ],
		[ 'Argentinië', '20'  ],
		[ 'Republiek van Argentinië', '20'  ],
		[ 'Chili', '20'  ],
		[ 'Republiek van Piratini', '20'  ],
		[ 'Ecuador', '20'  ],
		[ 'Bolivia', '20'  ],
		[ 'Frans Algerije', '20'  ],
		[ 'Brits Egypte', '20'  ],
		[ 'Frans West-Afrika', '20'  ],
		[ 'Abessinië', '20'  ],
		[ 'Frans Equatoriaal Afrika', '20'  ],
		[ 'Anglo-Egyptisch Soedan', '20'  ],
		[ 'Unie van Zuid-Afrika', '20'  ],
		[ 'Belgisch Congo', '20'  ],
		[ 'Duits Kameroen', '20'  ]
	],
	[ 
		[ 'Republiek van Australië', '21'  ],
		[ 'Nederlands Oost-Indië', '21'  ],
		[ 'Het Duitse Rijk', '20'  ],
		[ 'Griekenland', '20'  ],
		[ 'Brits Canada', '20'  ],
		[ 'Verenigde Latijns-Amerikaanse Naties', '20'  ],
		[ 'Caribische Eilandenrepubliek', '20'  ],
		[ 'Frans Algerije', '20'  ],
		[ 'Unie van Zuid-Afrika', '20'  ],
		[ 'Duits Kameroen', '20'  ],
		[ 'Portugees Mozambique', '20'  ],
		[ 'Frans Madagascar', '20'  ],
		[ 'Republiek Opper Volta', '20'  ],
		[ 'Yakutia', '20'  ],
		[ 'Frankrijk', '19'  ],
		[ 'Oostenrijk-Hongarije', '19'  ] 
	],
	[ 
		[ 'Argentinië', '32'  ],
		[ 'Japanse rijk', '31'  ],
		[ 'Belgisch Congo', '26'  ],
		[ 'Republiek Opper Volta', '26'  ],
		[ 'Het Koninkrijk Engeland', '25'  ],
		[ 'Arabië', '25'  ],
		[ 'Kazachstan', '24'  ],
		[ 'Frans Algerije', '23'  ],
		[ 'Frankrijk', '21'  ],
		[ 'Het Duitse Rijk', '21'  ],
		[ 'Italië', '21'  ],
		[ 'Verenigde Staten van Amerika', '21'  ],
		[ 'Abessinië', '21'  ],
		[ 'Duits Namibië', '21'  ],
		[ 'Koreaanse Rijk', '21'  ],
		[ 'Australië', '21'  ]
	],
	[ 
		[ 'Het Duitse Rijk', '27'  ],
		[ 'Het Koninkrijk Engeland', '27'  ],
		[ 'Italië', '27'  ],
		[ 'Zweden', '26'  ],
		[ 'Belgisch Congo', '26'  ],
		[ 'Duits Namibië', '26'  ],
		[ 'Frankrijk', '25'  ],
		[ 'Frans Algerije', '25'  ],
		[ 'Unie van Zuid-Afrika', '25'  ],
		[ 'Nederlands Oost-Indië', '25'  ],
		[ 'Arabië', '24'  ],
		[ 'Republiek China', '23'  ],
		[ 'Baffin', '21'  ],
		[ 'Republiek van Argentinië', '21'  ],
		[ 'Ecuador', '21'  ],
		[ 'Brits Egypte', '21'  ]
	]
	];

	console.log(daymix(dayindex));

	function daymix(dayindex) {
		console.log('[DEBUG] Start daymix');
		output = [];
		for(var i=0;i<dayindex.length;i++) {
			console.log('[DEBUG] Doing loop');
			for(var p=0;p<dayindex[i].length)
				for(player in dayindex[i]) {
					console.dir(player);
					playerindex = output.indexOf(player[0]);
					console.log('[DEBUG] Playerindex: ' + playerindex);
					if(playerindex = '-1') {
						lenght = output.length++;
						output[lenght] = [];
						output[lenght].push(player[0]);
						for(var o=1;o<output[0].length;) {
							output[lenght].push('');
						}
						output[lenght].push(player[1]);
					}
					else {
						console.log('[DEBUG] Else, player[0]: ' + player[0]);
						output[playerindex].push(player[0])
					}
				}
		}
		return output;
	}
