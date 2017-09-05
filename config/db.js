const mongoose=require("mongoose");
var connection_string = 'mongodb://127.0.0.1:27017/task';
// if OPENSHIFT env variables are present, use the available connection info:
mongoURL = process.env.OPENSHIFT_MONGODB_DB_URL || process.env.MONGO_URL,
mongoURLLabel = "";
if (mongoURL == null && process.env.DATABASE_SERVICE_NAME) {
  var mongoServiceName = process.env.DATABASE_SERVICE_NAME.toUpperCase(),
      mongoHost = process.env[mongoServiceName + '_SERVICE_HOST'],
      mongoPort = process.env[mongoServiceName + '_SERVICE_PORT'],
      mongoDatabase = process.env[mongoServiceName + '_DATABASE'],
      mongoPassword = process.env[mongoServiceName + '_PASSWORD']
      mongoUser = process.env[mongoServiceName + '_USER'];

  if (mongoHost && mongoPort && mongoDatabase) {
    mongoURLLabel = mongoURL = 'mongodb://';
    if (mongoUser && mongoPassword) {
      mongoURL += mongoUser + ':' + mongoPassword + '@';
    }
    // Provide UI label that excludes user id and pw
    mongoURLLabel += mongoHost + ':' + mongoPort + '/' + mongoDatabase;
    mongoURL += mongoHost + ':' +  mongoPort + '/' + mongoDatabase;

  }
}
var db = null,
    dbDetails = new Object();

var initDb = function(callback) {
  if (mongoURL == null) return;

  var mongodb = require('mongodb');
  if (mongodb == null) return;
  mongoose.connect(mongoURL,{
    useMongoClient: true
    /* other options */
  });
  mongoose.Promise=global.Promise;
};

if(process.env.MONGODB_PASSWORD){
  connection_string = "mongodb://"+process.env.MONGODB_USER + ":" +
  process.env.MONGODB_PASSWORD + "@" +
  "mongodb.taskmanager.svc" + ':' +
  27017 + '/' +
  process.env.MONGODB_DATABASE;
}
mongoose.connect(connection_string,{
  useMongoClient: true
  /* other options */
});
mongoose.Promise=global.Promise;
module.exports={mongoose};
