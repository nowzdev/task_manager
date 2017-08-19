const fs=require("fs");
const _=require("lodash");
var logs=(path,message)=>{
  fs.appendFileSync(path,message+"\n")
}
var date=(val=false)=>{
  var date;
  if(_.isNumber(val) && val){
      date=new Date(val);
  }else{
    date=new Date();
  }
  return `${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}:${date.getMilliseconds()}`;
}
module.exports={logs,date}
