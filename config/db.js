const mongoose=require("mongoose");
console.log(process.env.MONGOLAB_URI)
mongoose.connect(process.env.MONGOLAB_URI);
mongoose.Promise=global.Promise;
module.exports={mongoose};
