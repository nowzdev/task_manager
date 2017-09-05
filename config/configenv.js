var env=process.env.NODE_ENV || "development";
var env="wow";
if(env==='development' || env==="test"){
  var config=require("./configenv.json");
  var envConfig=config[env];
  Object.keys(envConfig).forEach((key)=>{
    process.env[key]=envConfig[key]
  })
}
// if(environment === "test"){
//   process.env.MONGOLAB_URI="mongodb://localhost/testtask";
//   process.env.PORT=3000;
// }else if (environment === "development") {
//   process.env.MONGOLAB_URI="mongodb://localhost:27017/task";
//   process.env.PORT=3001;
// }
module.exports={env}
