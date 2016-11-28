/**
 * Created by Administrator on 2016/10/31.
 */
var mongoose = require("mongoose");
var RoomSchema = require("../schemas/chatroom");
var Room = mongoose.model('Room',RoomSchema);

module.exports = Room;
