var request = require('request');

function searchBook(bookName, callback) {

  var book = {};
  var url = "https://api.douban.com/v2/book/search?count=1&q=";
  url += encodeURI(bookName);

  request(url, function(error, res, body) {

    if (!error && res.statusCode == 200) {

      var str = JSON.parse(body);
      var books = str.books[0];

      book = {
        title: books.title || "标题未知",
        author: books.author[0] || "作者未知",
        rating: books.rating.average || "评分未知",
        img: books.images.large || "未找到图片",
        summary: books.summary || "没有摘要",
        alt: books.alt || "地址不存在"
      };
    }

    callback(error, book);

  });

};

exports.searchBook = searchBook;
