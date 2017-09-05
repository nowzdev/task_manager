var {mongoose}=require("./../config/db");
const {logs,date}=require("./../functions/globalfunc.js");
const _=require("lodash");
var TasksSchema=new mongoose.Schema({
  task:{
    type:String,
    required:true,
    minlength:4,
    trim:true
  },
  CreatedIn:{
    type:Number,
    trim:true},
  Completed:{
    default:false,
    type:Array,
  },
  CompletedAt:{
    type:Array,
    trim:true,
    default:false
  },
  endTime:{
    type:Number,
    default:null
  },
  repeat:[
    {
    status:{
      type:Boolean,
      default:false
    },
    StartTime:{
      type:Number,
      default:null
    },
    ByDay:{
      type:Array,
      default:[]
    },
    now:{
      type:Array,
      default:[]
    }
  }],
  _creator:{
    type:mongoose.Schema.Types.ObjectId,
    required:true
  }
})

TasksSchema.methods.toJSON=function(){
  var task=this.toObject();
  task.CreatedIn=date(task.CreatedIn);
  if(_.isNumber(task.CompletedAt[task.CompletedAt.length-1])){
       task.CompletedAt[task.CompletedAt.length-1]=date(task.CompletedAt[task.Completed.length-1]);
    }else{
      task.CompletedAt[task.CompletedAt.length-1]=false;
    }
  if(task.endTime){
    if(task.endTime<date().getTime() && !task.Completed[0]){
      task.Completed[0]="failed";
    }
    task.endTime=date(task.endTime);
  }
  return _.pick(task,["task","CreatedIn","Completed","CompletedAt","endTime"]);
}
var team=function(val,Task){
  if(val){
    if(val.repeat.length === 1){
    if(_.isBoolean(val.repeat[0].status) && val.repeat[0].status && val.repeat[0].ByDay.length > 0){
    var date=new Date(val.CreatedIn);
    var Hour=val.repeat[0].ByDay[1];
    var Day=val.repeat[0].ByDay[0];
    var Minute=val.repeat[0].ByDay[2];
    var int=(((new Date().getTime()-val.repeat[0].StartTime)*(10**-3)/86400).toFixed())/val.repeat[0].ByDay[0];
    var int=int.toString();
    var int=int.split(".");
    date.setHours(Hour);
    date.setMinutes(Minute);
    var now=[];
    for(x=1;x<=(int[0]);x++){
      now.push(date.setDate(date.getDate()+val.repeat[0].ByDay[0]));
    }
    var sum=_.difference(now,val.repeat[0].now);
    val.repeat[0].now=val.repeat[0].now.concat(sum);
    sum.fill(false);
    val.Completed=val.Completed.concat(sum)
    val.CompletedAt=val.CompletedAt.concat(sum)
    Task.update({_id:val._id.toHexString()},{$set:val}).then((s)=>{
          console.log(s.repeat[0])
    });
  }
  }
  }
}
TasksSchema.post("findOne",function(val){var Task=this;team(val,Task)})
var tasks=mongoose.model("task",TasksSchema);

module.exports={tasks};
