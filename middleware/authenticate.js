const {users}=require("../models/users");
var authenticate=(req,res,next)=>{
  users.findByToken(req.header("x-auth")).then((user)=>{
    if(!user){
     return Promise.reject();
    }
    req.user=user;
    next();
  }).catch((e)=>{
    res.sendStatus(401);
  })
}
module.exports={authenticate};
