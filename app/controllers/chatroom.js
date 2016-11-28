/**
 * Created by Administrator on 2016/10/31.
 */
var Room = require("../models/chatroom");

//创建房间
exports.createRoom = function (req, res) {
		var _room = req.body.room;
		console.log(_room);
		if(!_room.roomName&&!_room.password){
			return res.redirect("/list")
		}
		Room.findOne({roomName:_room.roomName},function(err,room){
			if(err){
				console.log(err)
			}
			if(room){
				return res.redirect("/list")
			}else{
				var room = new Room(_room);
				room.save(function(err,user){
					if(err){
						console.log(err)
					}
					res.redirect("/list")
				})
			}
		})
};

// roomlist(房间列表)
exports.roomList=function(req,res){
	Room.find({},function (err, rooms) {
		if(err){
			console.log(err)
		}
		res.render('roomList',{
			roomList:rooms
		});
		
	});
};

//进入房间
exports.intoRoom = function (req, res) {
	var userRoom = req.body.room;
	Room.findOne({_id:userRoom.roomID},function (err, room) {
		console.log(room.members.indexOf(req.session.user._id));
		if(room.members.indexOf(req.session.user._id) == -1){
			// room.members.push(req.session.user._id);
			room.save(function () {
				Room
					.findOne({_id:userRoom.roomID})
					.populate({path:'members',select:'name'})
					.exec(function (err, rooms) {
						console.log(rooms);
						res.render('chatpage',rooms)
					});
			});
		}
		else {
			Room
				.findOne({_id:userRoom.roomID})
				.populate({path:'members',select:'name'})
				.exec(function (err, rooms) {
					console.log(rooms);
					res.render('chatpage',rooms)
				});
		}
	});
};
