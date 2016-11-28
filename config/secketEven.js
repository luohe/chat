/**
 * Created by Administrator on 2016/11/4.
 */
var socketio = require('socket.io');
var Room = require("../app/models/chatroom");
var User = require('../app/models/user');
var user=[];
var io;
exports.listen=function (server) {
	io = socketio.listen(server);
	io.set('log level', 1);
	io.on('connection', function (socket) {
		//用户进入房间
		socket.on('weJion',function (obj) {
			var userSign = socket.request.headers.cookie.split(";").join("=").split("=")[socket.request.headers.cookie.split(";").join("=").split("=").indexOf('io')+1];
			var index = user.length;
			user[index+1]={};
			user[index+1].name = obj.userName;
			user[index+1].Sign = userSign;
			Room.findOne({roomName:obj.roomName})
				.populate({path:'members',select:'name'})
				.exec(function (err, room) {
					if(err) return console.log(err);
					user[index+1].house = room._id;
					User.findOne({name:obj.userName},function (err, currentUser) {
						var memberIndex;
						var memberNum;
						for (var i = 0;i<room.members.length;i++){
							if(room.members[i].name == obj.userName){
								memberIndex = i;
								memberNum=1;
								break;
							}else{
								memberNum=0;
							}
						}
						room.members.splice(memberIndex,memberNum);
						room.members.push({
							_id:currentUser._id,
							name:obj.userName
						});
						room.save(function (err, currentRoom) {
							if (err) return console.log(err);
							socket.join(user[index+1].house);
							io.to(user[index+1].house).emit('system',user[index+1].name+"加入了房间",currentRoom.members);
						})
					});
				})
		});
		//用户断开连接
		socket.on('disconnect',function () {
			var userSign = socket.request.headers.cookie.split(";").join("=").split("=")[socket.request.headers.cookie.split(";").join("=").split("=").indexOf('io')+1];
			var index;
			for(var i = 0;i<user.length;i++){
				if(user[i]!=undefined&&user[i].Sign == userSign){
					index = i;
					console.log(index);
				}
			}
			User.findOne({name:user[index].name},function (err,obj) {
				if(err) return console.log(err);
				var userName = user[index].name;
				var roomID = user[index].house;
				
				
				Room.findOne({_id:roomID})
					.populate({path:'members',select:'name'})
					.exec(function (err,roomObj) {
						if(err) return console.log(err);
						console.log(roomObj.members);
						var index1;
						
						for(var i = 0;i<roomObj.members.length;i++){
							if(roomObj.members[i].name==userName){
								index1 = i;
								console.log(index1)
							}
						}
						if(index1!=-1){
							roomObj.members.splice(index1,1);
						}
						roomObj.save(function (err,obj) {
							if(err) return console.log(err);
							socket.leave(roomID);
							io.to(roomID).emit('system',userName+"退出了房间",obj.members);
						})
					});
			})
		});
		// 接收用户消息,发送相应的房间
		socket.on('message', function (msg) {
			var userSign = socket.request.headers.cookie.split(";").join("=").split("=")[socket.request.headers.cookie.split(";").join("=").split("=").indexOf('io')+1];
			var index;
			for(var i = 0;i<user.length;i++){
				if(user[i]!=undefined&&user[i].Sign == userSign){
					index = i;
					console.log(index);
					break;
				}
				if(i==(user.length-1)&&user[i].Sign != userSign){
					return false;
				}
			}
			var userName = user[index].name;
			var roomID = user[index].house;
			console.log(userName);
			console.log(msg);
			socket.broadcast.to(roomID).emit('msg',userName, msg);    //给同一房间的其他用户广播
			socket.emit('userInfo',userName, msg);                   //成功后再通知自己通知一次
		});
	});
};