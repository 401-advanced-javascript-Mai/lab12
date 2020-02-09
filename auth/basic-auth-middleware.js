/* eslint-disable no-unused-vars */
'use strict';

const base64 = require('base-64');
const users = require('./userModel');
const jwt = require('jsonwebtoken');


function generateToken(user) {
  let token = jwt.sign({ id: user._id  }, process.env.SECRET);
  return token;
}


module.exports = (req, res, next) => {

  if(!req.headers.authorization) { next('invalid login'); return; }

  //   split the username and passowred from the header
  let basic = req.headers.authorization.split(' ').pop();
  //   let basic = req.headers.authorization.split(' : ')[1]



  // split username and password from each other 
  let [user, password] = base64.decode(basic).split(':');


  users.authenticateBasic(user, password)
    .then(validUser => {
      console.log('validUser', validUser);
      req.token = generateToken(validUser);
      console.log('token:', req.token);
      next();
    })
    .catch( err => next('invalid login2'));
};