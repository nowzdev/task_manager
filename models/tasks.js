var {mongoose}=require("./../config/db");
const {logs,date}=require("./../functions/globalfunc.js");
const _=require("lodash");
var TasksSchema=new mongoose.Schema({
  task:{
    type:String,
    required:true,
    minlength:1,
    trim:true
  },
  CreatedIn:{
    type:Number,
    trim:true},
  Completed:{
    default:false,
    type:Boolean,
  },
  CompletedAt:{
    type:String,
    minlength:10,
    maxlength:10,
    trim:true,
    default:null
  }
})
TasksSchema.methods.toJSON=function(){
  var task=this.toObject();
  task.CreatedIn=date(task.CreatedIn);
  if(task.Completed){
    task.CompletedAt=date(task.CompletedAt);
  }
  return _.pick(task,["task","CreatedIn","Completed","CompletedAt"]);
}
var tasks=mongoose.model("task",TasksSchema);

module.exports={tasks};
