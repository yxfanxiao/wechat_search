/*jshint node:true*/

//------------------------------------------------------------------------------
// node.js starter application for Bluemix
//------------------------------------------------------------------------------

// This application uses express as it's web server
// for more info, see: http://expressjs.com
var express = require('express');
var wechat = require('wechat');
var search = require('./book');
var request = require('request');
var search_CET = require('./cet');
var config = {
  token: '123456lhy',
  appid: 'wx9dfb24e7650006a8',
  encodingAESKey: 'TXo1ZeGkFFY97SSPuIY5FVs2i4JiTiBVbeZ11D0vX6t'
};
// cfenv provides access to your Cloud Foundry environment
// for more info, see: https://www.npmjs.com/package/cfenv
var cfenv = require('cfenv');

// create a new express server
var app = express();

// serve the files out of ./public as our main files
app.use(express.static(__dirname + '/public'));
app.use(express.query());
app.use('/wechat', wechat(config, function (req, res, next) {
    var message = req.weixin;
    if(message.MsgType === "text"){
        if(message.Content.substring(0,3) == "CET") {
          var CET = search_CET.searchCET(message.Content,function(error,result){
            var ret_result = '姓名:' + result.name +
                             '\n学校:' + result.school +
                             '\n考试类别:' + result.cata +
                             '\n准考证号:' + result.id +
                             '\n考试时间:' + result.time +
                             '\n听力:' + result.listen +
                             '\n阅读：' + result.read +
                             '\n写和翻译：' + result.write +
                             '\n总分：' + result.score
            res.reply(ret_result);
          });

        }
        else
        {
          var query = search.searchBook(message.Content, function(error, book) {
            res.reply([
            {
              title: book.title + "  " + book.author+ "  " +"评分:"+ book.rating,
              description: book.summary.substring(0,100)+"...",
              picurl: book.img,
              url: book.alt
            }
            ]);
        });
        }
    }
    else 
    {
      res.reply("请发送书名，以查询书籍~~\n也可以查询2014/12月的CET成绩，格式如下：CET+120120142205409+王幼根");
    }
}));
// app.use('/wechat', wechat(config, function (req, res, next) {
//   // 微信输入信息都在req.weixin上
//   var message = req.weixin;
//   if(message.MsgType === "text"){
//     if(message.Content === "小王子") {

  
//     }
//     else if(message.Content === "关键字"){
//       res.reply("是的，关键字已经收到~~");
//     }
//     else if(message.Content === "王思聪"){
//       res.reply([
//       {
//         title: '国名老公',
//         description: '为人低调的网红小王 万达集团董事',
//         picurl: 'http://tp2.sinaimg.cn/1826792401/180/5718070704/1',
//         url: 'http://weibo.com/sephirex?c=spr_qdhz_bd_baidusmt_weibo_s&nick=%E7%8E%8B%E6%80%9D%E8%81%AA'
//       }
//     ]);
//     }else{
//         res.reply("您发了："+message.Content);
//     }
      
//   }else if(message.MsgType === "voice"){
//     res.reply('您的语音我们已经收到，请等待答复~~');
//   }
 
// }));

// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();

// start server on the specified port and binding host
app.listen(appEnv.port, appEnv.bind, function() {

  // print a message when the server starts listening
  console.log("server starting on " + appEnv.url);
});


          