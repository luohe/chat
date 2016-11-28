/**
 * Created by Administrator on 2016/10/31.
 */
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;
var bcrypt = require('bcryptjs');
var RoomSchema = new Schema({
	roomName:{
		unique:true,
		type:String
	},
	password:String,
	number:{
		type:Number,
		default:100,
	},
	members:[
			{
				type:ObjectId,
				ref:'User'
			}
		],
	meta:{
		createAt:{
			type:Date,
			default:Date.now()
		},
		updateAt:{
			type:Date,
			default:Date.now()
		}
	}
});

// schema.pre 在进行某项操作时先用方法进行过滤；
RoomSchema.pre('save',function(next){
	if(this.isNew){
		this.meta.createAt = this.meta.updateAt=Date.now()
	}else{
		this.meta.updateAt = Date.now()
	}
// 用同步写法
	var hash = bcrypt.hashSync(this.password);
	this.password = hash;
	
	next()
});


//挂载在schema上的model的实例方法
RoomSchema.methods = {
	comparePassword:function(_password,cb){
		var hash = this.password;
		
		var isMatch = bcrypt.compareSync(_password,hash);
		
		cb(null,isMatch);
	}
};

// 挂载在schema上的静态方法；
RoomSchema.statics = {
	fetch :function(cb){
		return this
			.find({})
			.sort('meta.updateAt')
			.exec(cb)
	},
	findById:function(id,cb){
		return this
			.findOne({_id:id})
			.exec(cb)
	}
};

module.exports = RoomSchema;