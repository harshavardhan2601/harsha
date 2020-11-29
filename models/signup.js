var mongoose = require("mongoose");
var SignupSchema = new mongoose.Schema({
    surname:String,
    firstname:String,
    lastname:String,
    email:String,
    password:String,
    mobile_number:String,
    d_o_b:String,
    education:String,
    occupation:String,
    blood_group:String,
    gender:String,
    proof:String,
    inproof:String,
    address:String,
    City:String,
    pincode:String,
    State:String,
    file_attach1:String,
    status:Number,
  create_date: {
    type: Date,
    default: Date.now
  }
  
});

mongoose.model("signup", SignupSchema );