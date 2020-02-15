/* eslint-disable no-unused-vars */
'use strict';

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
require('dotenv').config();
// e

//  our schema 
const users = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  
});


//   Hash the plain text password given before you save a user to the database
users.pre('save', async function (user) {
  this.password = await bcrypt.hash(this.password, 5);
    
});


//   Method to authenticate a user using the hashed password
users.statics.authenticateBasic = async function(user , password){
   
  let foundUser = await this.find({username: user});

  if (foundUser) {
    let valid = bcrypt.compare(password, foundUser[0].password);
    return valid ? foundUser[0].username : Promise.reject();
  }
  else {
    Promise.reject();
  }
}; 

  
users.statics.authenticateToken = async function(token) {
  console.log('token', token);
  try {
    // console.log('hi');
  
    // console.log('token inside try' , token)
    // to do the time 
    // let token = jwt.sign({ username: user.username}, process.env.SECRET, { expiresIn: 60 * 15});


    let tokenObject = await  jwt.verify(token, process.env.SECRET);
    console.log('token', token);
    console.log('token object', tokenObject);
    console.log('muna');
    // let {id} = tokenObject ;
    // let data =   this.findById(id)
    // this.findById(id)
    // console.log ('users.tokenObject.id', this.findById(id) )
    return this.findOne({id:tokenObject._id});
  
    // console.log ('users.findone', this.findOne({_id: tokenObject.id}))
    //     // console.log(' users', tokenObject.user);
    //     if (data) {
    // // console.log('inside if')
    //      return ( tokenObject)
    //       // return Promise.resolve(this.findOne({_id: tokenObject.id}));
    //     } else {
    //       return Promise.reject();
    //     }
  } catch (err) {
    console.log('mai');
    return Promise.reject();
  }
};
// users.statics.authenticateToken = async function(token) {

// // async authenticateToken(token){
//   try {
//     let parsedTokenObject = jwt.verify(token, process.env.SECRET);
//     console.log('parsed token obj', parsedTokenObject);
//     if(users.find({username: parsedTokenObject.username})){
//       return Promise.resolve(parsedTokenObject);
//     }
//     else {
//       return Promise.reject();
//     }
//   }
//   catch(error) {
//     return Promise.reject();
//   }
// }

//   Method to generate a Token following a valid login
users.methods.generateToken = function(user) {
  // let ourUserInfo = {

  // } 
  let token = jwt.sign({ id: this._id  }, process.env.SECRET);
  return token;
};

module.exports = mongoose.model('users', users);