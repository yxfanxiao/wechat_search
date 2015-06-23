var request = require('request');
var cheerio = require('cheerio')

function searchCET(searchString, callback) {

  var result = {};

  var _url = 'http://www.chsi.com.cn/cet/query?zkzh='
  var str = searchString.split('+');
  var zkzh = str[1];
  _url += str[1];
  var xm = str[2];
  _url += '&xm='
  _url += encodeURI(str[2]);

  var options = {
    url: _url,
    headers: {
      'Host': 'www.chsi.com.cn',
      'Proxy-Connection': 'keep-alive',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/43.0.2357.124 Safari/537.36',
      'Referer': 'http://www.chsi.com.cn/cet/',
      'Accept-Language': 'zh-CN,zh;q=0.8'
    }
	};
  request(options, function(error, res, body) {

    if (!error && res.statusCode == 200) {
      $ = cheerio.load(body);
      result = {
      	'name': $('#leftH .cetTable>tr:nth-child(1)>td').text(),
      	'school': $('#leftH .cetTable>tr:nth-child(2)>td').text(),
      	'cata': $('#leftH .cetTable>tr:nth-child(3)>td').text(),
      	'id': $('#leftH .cetTable>tr:nth-child(4)>td').text(),
      	'time': $('#leftH .cetTable>tr:nth-child(5)>td').text(),
      	'listen': $('#leftH .cetTable>tr:nth-child(6)>td').text().replace(/\s+/g, '').replace(/[\u4E00-\u9FA5]/g, "").toString().split('：')[1],
      	'read': $('#leftH .cetTable>tr:nth-child(6)>td').text().replace(/\s+/g, '').replace(/[\u4E00-\u9FA5]/g, "").toString().split('：')[2],
      	'write': $('#leftH .cetTable>tr:nth-child(6)>td').text().replace(/\s+/g, '').replace(/[\u4E00-\u9FA5]/g, "").toString().split('：')[3],
      	'score': $('#leftH .cetTable>tr:nth-child(6)>td>span.colorRed').text().replace(/\s+/g, '')
      };
    }

    callback(error, result);

  });

};

exports.searchCET = searchCET;
