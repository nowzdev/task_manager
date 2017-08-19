const express=require("express");
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
app.post("/tasks/add",(req,res)=>{
  var task=req.body;
  var task=_.pick(task,["task"]);
  task.CreatedIn=new Date().getTime();
  var Task=new tasks(task);
  Task.save().then((val)=>{
    logs("server.log",`Data Created in ${date(val.CreatedIn)}`)
    res.send(val);
  }).catch(()=>{
    res.sendStatus(400);
  })
});
app.get("/tasks/find/:id",authenticate,(req,res)=>{
  const {id}=req.params;
  if(!ObjectID.isValid(id)){
    return res.sendStatus(400);
  }
  tasks.findById(id).then((val)=>{
    if(!val){
      return res.sendStatus(404);
    }
    logs("server.log",`Data is finded by id in ${date()}`);
    res.send(val);
  }).catch(()=>{
    res.sendStatus(400);
  })
})
app.patch("/tasks/update/:id",authenticate,(req,res)=>{
  var task=_.pick(req.body,["task","Completed"]);
  const {id}=req.params;
  if(!ObjectID.isValid(id)){
    return res.sendStatus(400);
  }
  if(task.Completed && _.isBoolean(task.Completed)){
        task.CompletedAt=new Date().getTime();
  }else{
    task.Completed=false;
    task.CompletedAt=null;
  }
  tasks.findByIdAndUpdate(id,{$set:task},{new:true}).then((val)=>{
    if(!val){
      return res.sendStatus(404);
    }
    logs("server.log",`Data Updated by id in ${date(val.CompletedAt)}`);
    res.send(val);
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
app.post("/users/me",authenticate,(req,res)=>{
  logs("server.log",`user finded by token in ${date()}`);
   res.send(req.user);
})
app.listen(3000,()=>{
  logs("server.log",`Server started in port 3000 in ${date()}`)
})
