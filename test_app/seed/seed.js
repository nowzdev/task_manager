const {ObjectID}=require("mongodb");
const {tasks}=require("./../../models/tasks")
const {users}=require("./../../models/users")
const jwt=require("jsonwebtoken");
const {date}=require("./../../functions/globalfunc")
var idUser1=new ObjectID();
var idUser2=new ObjectID();
var Users=[
  {
    _id:idUser1,
    email:"saminowz@gmail.com",
    password:"123456s7",
    tokens:[{
      access:"auth",
      token:jwt.sign({_id:idUser1,access:"auth"},process.env.JWT_SECRET).toString()
    }]
  },
  {
    _id:idUser2,
    email:"1959.sami.1959@gmail.com",
    password:"12345s67",
    tokens:[{
      access:"auth",
      token:jwt.sign({_id:idUser2,access:"auth"},process.env.JWT_SECRET).toString()
    }]
  }
]
const task=[
{
  _id:new ObjectID(),
  task:"Test Task 1",
  CreatedIn:date().getTime(),
  _creator:idUser1
},
{
  _id:new ObjectID(),
  task:"Test Task2",
  Completed:true,
  CreatedIn:date().getTime(),
  _creator:idUser2
}]
const populateTodods=(done)=>{
  tasks.remove({}).then(()=>{
    return tasks.insertMany(task)
  }).then(()=>{
    done();
  })
}
const populateUsers=(done)=>{
   users.remove({}).then(()=>{
     var UserOne=new users(Users[0]).save();
     var UserTwo=new users(Users[1]).save();
     return Promise.all([UserOne]);
   }).then(()=>{
     done()
   }).catch((e)=>{
     Promise.reject();
   })
};
module.exports={populateTodods,task,populateUsers,Users};
