const {mongoose}=require("./../config/db");
const _=require("lodash");
const jwt=require("jsonwebtoken");
const bcrypt=require("bcryptjs");
const validator=require("validator");
var UserShema=new mongoose.Schema({
  email:{
    type:String,
    unique:true,
    minlength:1,
    trim:true,
    validate:{
      validator:function(val){
        return validator.isEmail(val)
      },
      message:"{VALUE} is not a valid email"
    }
  },
  password:{
    type:String,
    minlength:6,
    required:true
  },
  tokens:[{
    token:{
      type:String,
      required:true
    },
    access:{
      type:String,
      required:true
    }
  }]
})
UserShema.methods.GenerateToken=function(){
  var users=this;
  var access="auth";
  var token=jwt.sign({_id:users._id,access},"secretcodenowztestcodelovemyself");
  users.tokens.push({access,token})
  return users.save().then(()=>{
    return token;
  }).catch((e)=>{
    return Promise.reject(e)
  })
}
UserShema.methods.removeToken=function(token){
  var users=this;
  return users.update({$pull:{tokens:{token}}})
}
// UserShema.methods.toJSON=function(){
//   return _.pick(this.toObject(),["email","password"]);
// }
UserShema.statics.findByToken=function(token){
  var users=this;
  var decoded;
  try {
    decoded=jwt.verify(token,process.env.JWT_SECRET);
  } catch (e) {
    return  Promise.reject();
  }
  return users.findOne({'_id':decoded._id,'tokens.token':token,'tokens.access':decoded.access});
}
UserShema.statics.findByCredentials=function(email,password){
  var users=this
  return users.findOne({email}).then((info)=>{
    if(!info){
      return Promise.reject();

    }
    return new Promise((resolve,reject)=>{
      bcrypt.compare(password,info.password,(err,res)=>{
        if(res){
            resolve(info)
        }else{
        reject(res);
      }
      })
    })
  })
}
UserShema.pre("save",function(next){
  var user=this;
   if(user.isModified("password")){
     bcrypt.genSalt(10,(err,salt)=>{
     bcrypt.hash(user.password, salt,(err,hash)=>{
     user.password=hash;
     next();
   });
 })
  }
   else{
     next();

   }
})
var users=mongoose.model("users",UserShema);
module.exports={users}
