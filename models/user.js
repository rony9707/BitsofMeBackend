const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  db_username:{
    type:String,
    unique:true,
    required:true
  },
  db_password:{
    type:String,
    required:true
  },
  db_phofilePic:{
    type:String,
    unique:true,
    required:true
  },
  db_phofilePic_100:{
    type:String,
    unique:true,
    required:true
  },
  db_email:{
    type:String,
    unique:true,
    required:true
  },
  db_fullname:{
    type:String,
    required:true
  },
  db_dob:{
    type:String,
    required:true
  },
  db_gender:{
    type:String,
    required:true
  },
  db_aboutUser:{
    type:String,
    required:true
  },
  db_phoneNumber:{
    type:String,
    required:true
  },
  db_address:{
    type:String,
    required:true
  },
  db_dtecre:{
    type:String,
    required:true
  },
  db_dtemod:{
    type:String,
    required:true
  },
  db_dteLastLogin:{
    type:String,
    required:true
  }
})


module.exports = mongoose.model("user",userSchema)