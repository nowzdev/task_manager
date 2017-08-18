const express=require("express");
const BodyParser=require("body-parser");
const {mongoose}=require("./config/db");
const {tasks}=require("./models/tasks");
const {users}=require("./models/users");
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
    logs("server.log",`Data Created in ${date()}`)
    res.send(val);
  }).catch(()=>{
    res.sendStatus(400);
  })
});
app.get("/tasks/find/:id",(req,res)=>{
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
app.patch("/tasks/update/:id",(req,res)=>{
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
    res.send(val);
  })
})
app.listen(3000,()=>{
  logs("server.log",`Server started in port 3000 in ${date()}`)
})
