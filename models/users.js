const {mongoose}=require("./../config/db");
const _=require("lodash");
const jwt=require("jsonwebtoken");
var UserShema=new mongoose.Schema({
  email:{
    type:String,
    unique:true,
    minlength:1,
    trim:true
    // validate:{
    //   validator:function(val){
    //     return validator.isEmail(val)
    //   },
    //   message:"{VALUE} is not a valid email"
    // }
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
  })
}
UserShema.methods.toJSON=function(){
  return _.pick(this.toObject(),["email","password"]);
}
UserShema.statics.findByToken=function(token){
  var users=this;
  var decoded;
  try {
    decoded=jwt.verify(token,"secretcodenowztestcodelovemyself");
  } catch (e) {
    return  Promise.reject();
  }
  return users.findOne({'_id':decoded._id,'tokens.token':token,'tokens.access':decoded.access});
}
var users=mongoose.model("users",UserShema);
module.exports={users};
