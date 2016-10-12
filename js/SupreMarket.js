var buytop = [];
var selltop = [];
var allcolumbs = [];
var products = ["Graan", "Vis", "IJzererts", "Hout", "Steenkool", "Olie", "Gas"];
var deals = [];
var inside = iframeRef( document.getElementById('ifm') )
if ($('.buy_table tr').length === 0) {
	$("#func_btn_stockmarket").click();
}
for (var i = 0, l = 2; i <= l; i+=1) {
	$($(".func_category")[i]).click();
	var sellcolums = [];
	var buycolums = [];
	$('.buy_table').each(function (index) {
		buycolums.push($(this).text().split(/\s+/));
	});
	$.each(buycolums, function(index) {
		buytop.push([buycolums[index][4], buycolums[index][6]]);
	});
	$('.sell_table').each(function (index) {
		sellcolums.push($(this).text().split(/\s+/));
	});
	$.each(sellcolums, function(index) {
		selltop.push([sellcolums[index][1], sellcolums[index][3]]);
	});
}
for (i = 0; i < selltop.length; i++) {
	allcolumbs.push([buytop[i], selltop[i]]);
}
console.log(allcolumbs);
$.each(allcolumbs, function(index) {
	for (var i = 0, l = allcolumbs[index].length; i < l; i+=2) {
		var buy = allcolumbs[index][i];
		var sell = allcolumbs[index][i+1];
		console.log(products[index] + ": Buy: " + buy[0] + "@$" + buy[1] + " Sell: " + sell[0] + "@$" + sell[1]);
		if(buy[1] <= sell[1]) {
			console.log("Deal!");
			allcolumbs[index].push(index);
			deals.push(allcolumbs[index]);
		}
	}
});
console.log(deals);
if(deals.length === 0) {
	console.log("Geen Deals");
}
$.each(deals, function(index) {
	buy = deals[index][0];
	sell = deals[index][1];
	product = products[deals[index][2]];
	buy[0] = parseInt(buy[0].replace (/,/g, ""));
	sell[0] = parseInt(sell[0].replace (/,/g, ""));
	if (sell[0] <= buy[0]) { 
		verschil = sell[0]; 
	}
	else { 
		verschil = buy[0]; 
	}
	console.log(product + ": Buy: " + buy[0] + "@$" + buy[1] + " Sell: " + sell[0] + "@$" + sell[1]);
	buyprice = Math.round(verschil * buy[1]);
	sellprice = Math.round(verschil * sell[1]);
	profit = sellprice - buyprice;
	console.log("verschil: " + verschil + " profit: $" +  profit);
});
