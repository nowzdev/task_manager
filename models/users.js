const {mongoose}=require("./../config/db");
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
    auth:{
      type:String,
      required:true
    }
  }]
})

var users=mongoose.model("users",UserShema);
module.exports={users};
