

var request = require('request');
var async = require('async');
var fs = require('fs');
var path = require('path');

var fp = path.join(__dirname, 'admin-page-links.txt');
var resFP = path.join(__dirname, 'admin-page-results.json');

var fileData = fs.readFileSync(fp).toString();
var jsonData = JSON.parse(fileData);
var pages = jsonData.pages;

console.log('pages.length', pages.length);
// pages = [pages[1], pages[2], pages[3]];

var nonTwoHundo = [];

async.eachSeries(pages, function(url, cb) {
	request(url, function(error, response, body) {
		console.log('!page data!', response.statusCode, body.length, url);
		if(response.statusCode != 200) {
			nonTwoHundo.push({
				'page': url,
				'statusCode': response.statusCode,
				'accessDenied': body.indexOf('Access Denied'),
			});
		}

		setTimeout(cb, 5000);
		// cb();
	})
}, function(err) {
	var outTxt = JSON.stringify(nonTwoHundo, null, 1);
	// console.log(outTxt);
	fs.writeFileSync(resFP, outTxt);
})