const {environment}=require("./config/configenv");
const express=require("express");
var PORT=process.env.PORT;
var NODE_ENV=process.env.NODE_ENV;
var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080;
const BodyParser=require("body-parser");
const {mongoose}=require("./config/db");
const {tasks}=require("./models/tasks");
const {users}=require("./models/users");
const {authenticate}=require("./middleware/authenticate");
const {ObjectID}=require("mongodb");
const {logs,date}=require("./functions/globalfunc.js");
const _=require("lodash");
const fs=require("fs");
const app=express();
app.use(BodyParser.json());
app.post("/tasks/add",authenticate,(req,res)=>{
  var task=req.body;
  var task=_.pick(task,["task","endTime","repeat","status"]);
  task._creator=req.user._id;
  task.CreatedIn=date().getTime();
  if(task.repeat){
    if(task.repeat[0].status && task.repeat[0].ByDay.length > 0){
      task.repeat[0].StartTime=date().getTime();
    }
  }
  if(task.endTime && date().getTime() < date(task.endTime).getTime()){
    task.endTime=date(task.endTime).getTime();
  }else{
    task.endTime=null;
  }
  var Task=new tasks(task);
  Task.save().then((val)=>{
    logs("server.log",`Data Created in ${date(val.CreatedIn)}`)
    res.send(val);
  }).catch(()=>{
    res.sendStatus(400);
  })
});
app.get("/tasks/find/:id",authenticate,(req,res)=>{
  var {id}=req.params;
  if(!ObjectID.isValid(id)){
    return res.sendStatus(400);
  }
  tasks.findOne({_id:id,_creator:req.user._id}).then((val)=>{
    if(!val){
      return res.sendStatus(404);
    }
    logs("server.log",`Data is finded by id in ${date()}`);
    res.send(val);
  }).catch(()=>{
    res.sendStatus(400);
  })
})
app.delete("/tasks/remove/:id",authenticate,(req,res)=>{
  var {id}=req.params;
  if(!ObjectID.isValid(id)){
     //return Promise.reject();
     return     res.sendStatus(400);
  }
  tasks.findOneAndRemove({_id:id,_creator:req.user._id}).then((result)=>{
    if(!result){
      return res.sendStatus(404);
    }
    res.send(result);
  }).catch(()=>{
    res.sendStatus(400);
  })
})
app.patch("/tasks/update/:id",authenticate,(req,res)=>{
  var task=_.pick(req.body,["task","Completed","endTime","repeat"]);
  const {id}=req.params;
  if(!ObjectID.isValid(id)){
    return res.sendStatus(400);
  }
  if(task.repeat){
    if(task.repeat[0].status && task.repeat[0].ByDay.length > 0){
      task.repeat[0].StartTime=date().getTime();
    }
  }
  tasks.findOne({_id:id,_creator:req.user._id}).then((val)=>{
     if(!val){
       return Promise.reject();
     }
    if(!task.endTime || date().getTime() > date(task.endTime).getTime()){
      if(val.endTime){
        task.endTime=val.endTime;
      }
    }else{
      task.endTime=date(task.endTime).getTime();
    }
  if(task.Completed && _.isBoolean(task.Completed)){
    if(date().getTime() < task.endTime || !task.endTime){
       val.CompletedAt.pop();
       val.CompletedAt.push(date().getTime());
       task.CompletedAt=val.CompletedAt;
       val.Completed.pop();
       val.Completed.push(true);
       task.Completed=val.Completed;
    }
  }else if(task.Completed ===false){
    val.Completed.pop();
    val.Completed.push(false);
    task.Completed=val.Completed;
    val.CompletedAt.pop();
    val.CompletedAt.push(null);
    task.CompletedAt=val.CompletedAt;
  }else{
    delete(task.Completed);
    delete(task.CompletedAt);
  }
  return tasks.findOneAndUpdate({_id:id,_creator:req.user._id},{$set:task},{new:true})
  }).then((val)=>{
    if(!val){
      return Promise.reject();
    }
    logs("server.log",`Data Updated by id in ${date(val.CompletedAt)}`);
    res.send(val);
  }).catch((e)=>{
    res.sendStatus(404)
  })
})
app.post("/users/add",(req,res)=>{
  var User=new users(_.pick(req.body,["email","password"]));
  User.save().then(()=>{
    return User.GenerateToken();
  }).then((val)=>{
    logs("server.log",`users  Created in ${date()}`);
    res.header("x-auth",val).send(User)
  }).catch(()=>{
    res.sendStatus(400);
  })
})
app.get("/users/me",authenticate,(req,res)=>{
  logs("server.log",`user finded by token in ${date()}`);
   res.send(req.user);
})
app.post("/users/login",(req,res)=>{
  var {email,password}=_.pick(req.body,["email","password"]);
  users.findByCredentials(email,password).then((val)=>{
    return val.GenerateToken().then((token)=>{
      res.header("x-auth",token).send(val)
    })
  }).catch(()=>{
    res.sendStatus(404)
  })
})
app.delete("/users/me/token",authenticate,(req,res)=>{
  req.user.removeToken(req.token).then(()=>{
    res.sendStatus(200);
  },()=>{
    res.sendStatus(401);
  })
})
app.listen(port,()=>{
  logs("server.log",`Server started in ${environment} mode in port ${PORT} in ${date()}`)
})
module.exports={app,tasks,users}
