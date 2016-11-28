var mongoose = require("mongoose")
// bcrypt window系统无法进行node-gyp的rebuild,使用淘宝bcrypt代替
var bcrypt = require('bcryptjs');
var SALT_WORK_FACTOR = 10;

var UserSchema = new mongoose.Schema({
  name:{
    unique:true,
    type:String
  },
  password:String,
  // 0:nomal user
  // 1:verified user
  // 2:professonal user
  // >10:admin
  // >50:super admin
  role:{
    type:Number,
    default:0
  },
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
UserSchema.pre('save',function(next){
  var user = this;

  if(this.isNew){
    this.meta.createAt = this.meta.updateAt=Date.now()
  }else{
    this.meta.updateAt = Date.now()
  }

    // bcrypt.genSalt(SALT_WORK_FACTOR,function(err,salt){
  //   if(err) return next(err)

  //     bcrypt.hash(user.password,salt,function(err,hash){
  //       if(err) return next(err)
// 待证：user.password = hash 为异步执行，bcrypt.hash未执行完成，user.password = hash提前执行
  //       user.password = hash
  //       next()
  //     })
  // })


// 用同步写法
  var hash = bcrypt.hashSync(this.password);
  this.password = hash;
  
  next()
});
//挂载在schema上的model的实例方法
UserSchema.methods = {
  comparePassword:function(_password,cb){
    var hash = this.password;
    var isMatch = bcrypt.compareSync(_password,hash);

    cb(null,isMatch);

    // bcrypt.compare(_password,this.password,function(err,isMatch){
    //   if(err) return cb(err)

    //     cb(null,isMatch)
    // })
  }
};

// 挂载在schema上的静态方法；
UserSchema.statics = {
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

module.exports = UserSchema;
