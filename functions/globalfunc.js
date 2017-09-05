const fs=require("fs");
const _=require("lodash");
var logs=(path,message)=>{
  fs.appendFileSync(path,message+"\n")
}
var date=(val=false)=>{
  var date;
  if(val){
      date=new Date(val);
  }else{
    date=new Date();
  }
  if(date != "Invalid Date"){
    return date;
  }
  return false;
}
module.exports={logs,date}
