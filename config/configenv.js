var environment=process.env.NODE_ENV || "development";
if(environment === "test"){
  process.env.MONGOLAB_URI="mongodb://localhost/testtask";
  process.env.PORT=3000;
}else if (environment === "development") {
  process.env.MONGOLAB_URI="mongodb://localhost:27017/task";
  process.env.PORT=3000;
}
module.exports={environment}
