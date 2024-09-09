const mongoose = require('mongoose');
require('dotenv').config();

const connectToMongo = async() =>{
    try{
    await mongoose.connect(process.env.MONGO_URL);
    console.log('connected to mongo')
}
catch(error){
console.error('Error connecting mongoDB',error);
}
}
module.exports = connectToMongo;