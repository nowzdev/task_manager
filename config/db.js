const mongoose=require("mongoose");
var connection_string = 'mongodb://127.0.0.1:27017/task';
// if OPENSHIFT env variables are present, use the available connection info:
if(process.env.MONGODB_PASSWORD){
  connection_string = "mongodb://"+process.env.MONGODB_USER + ":" +
  process.env.MONGODB_PASSWORD + "@" +
  "nodejs-mongo-persistent-taskmanager.a3c1.starter-us-west-1.openshiftapps.com" + ':' +
  27017 + '/' +
  process.env.MONGODB_DATABASE;
}
mongoose.connect(connection_string,{
  useMongoClient: true
  /* other options */
});
mongoose.Promise=global.Promise;
module.exports={mongoose};
