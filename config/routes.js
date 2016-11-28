/**
 * Created by Administrator on 2016/10/31.
 */
var express = require('express');
var router = express.Router();
var User = require("../app/controllers/user.js");
var ChatRoom = require('../app/controllers/chatroom');

module.exports=function (app) {
    //首页
    app.get('/',User.index);
    
    // 注册页面
    app.get('/signup',User.showSignup);
    
    //登录页面
    app.get("/signin",User.showSignin);

    //用户注册
    app.post('/user/signup',User.signup);

    //用户登录
    app.post('/user/signin',User.signin);
    
    //用户退出
    app.get('/logout',User.logout);
	
		//创建房间
		app.post('/createRoom',User.signinRequired,ChatRoom.createRoom);

    //房间列表
    app.get('/list',User.signinRequired,ChatRoom.roomList);
    
    //进入房间
    app.post('/chat/into',User.signinRequired, ChatRoom.intoRoom);
};