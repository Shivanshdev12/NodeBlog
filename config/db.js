const mongoose = require('mongoose');

const connectDB = async()=>{
    try{
        const DB= await mongoose.connect(process.env.MONGO,{
            useNewUrlParser:true,
            useUnifiedTopology:true,
            useFindAndModify:false
        })
        console.log(`Connected to database..`)
    }
    catch(err){
        console.error(err);
    }
}

module.exports = connectDB;

