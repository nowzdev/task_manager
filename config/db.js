const mongoose=require("mongoose");
mongoose.connect("mongodb://localhost:27017/task");
module.exports={mongoose};
