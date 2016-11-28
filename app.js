/**
 * Created by Administrator on 2016/10/31.
 */
var express =require("express");
var jade = require('jade');
var port = process.env.PORT || 3000;
var path = require("path");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var cookieParser = require('cookie-parser');
// var cookieSession = require('cookie-session');
// 参考connect-mongo文档决定使用express-session做session，方便使用connect-mongo
var session = require("express-session");
var MongoStore = require("connect-mongo")(session);
// 日志实时打印
var logger =require('morgan');
var app = express();
var httpServer = require('http').Server(app);

mongoose.connect("mongodb://localhost/chat");

app.set('views' , './app/views/pages');
app.set('view engine' , 'jade');
//  app.helpers 和app.dynamicHelpers 是express2.X使用的 分别为静态/动态 视图助手通过其注册函数
//  app.locals.key1 = value1 为视图注册函数
app.locals.moment = require('moment');

app.use(bodyParser());

// 对session的使用，对登录用户登录状态的处理,session持久化
app.use(cookieParser());
app.use(session({
    secret:'chat',
    store:new MongoStore({
        url:"mongodb://localhost/chat",
        collection:'sessions'
    })
}));

app.use(function(req,res,next){
    var hour = 3600000;
    req.session.cookie.expires = new Date(Date.now() + hour);
    req.session.cookie.maxAge = hour;
    next();
});
// pre handle user（网页访问session预处理)
app.use(function(req,res,next){
    var _user = req.session.user;
    app.locals.user = _user;
    next()
});

// 开发环境的配置(记录器)
if('development' === app.get('env')){
    app.set('showStackError',true);
    app.use(logger(':method :url :status :response-time ms - :res[content-length]'));
    app.locals.pretty = true;
    mongoose.set('debug',true)
}
app.use(express.static(path.join(__dirname,'public')));

//http
require('./config/routes.js')(app);
httpServer.listen(port);

//socket
var chatServer = require("./config/secketEven");
chatServer.listen(httpServer);

console.log("server is started on" + port);