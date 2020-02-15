'use strict';


const superagent = require('superagent');
const users = require('./userModel.js');
const jwt = require('jsonwebtoken');


// const users = require('../auth/userModel.js');
function generateToken(user) {
  let token = jwt.sign({ id: user._id  }, process.env.SECRET);
  return token;
}


const tokenServerUrl = 'https://github.com/login/oauth/access_token';
const remoteAPI = 'https://api.github.com/user';

module.exports = async function authorize(req, res, next) {
  try {
    let code = req.query.code;
    // console.log('req.body' , req.body)
    console.log('my code:', code);
    let remoteToken = await exchangeCodeForToken(code);
    console.log('remote token:', remoteToken);
    let remoteUser = await getRemoteUserInfo(remoteToken);
    console.log('remote user:', remoteUser);
    let [user, token] = await getUser(remoteUser);
    req.user = user;
    req.token = token;
    console.log('user', user);
    next();
  } catch(err) {
    next(err);
  }
};
async function exchangeCodeForToken(code) {
  let tokenResponse = await superagent.post(tokenServerUrl).send({
    code: code,
    client_id: process.env.CLINENT_ID,
    client_secret: process.env.CLINENT_SECRET,
    redirect_uri:process.env.API_SERVER,
    grant_type: 'authorization_code',
  });
  let access_token = tokenResponse.body.access_token;
  return access_token;
}
async function getRemoteUserInfo(token) {
  let userResponse = await superagent.get(remoteAPI)
    .set('user-agent', 'express-app')
    .set('Authorization', `token ${token}`);
  let user = userResponse.body;
  return user;
}
async function getUser(remoteUser) {
  let userRecord = {
    username: remoteUser.login,
    password: 'mai',
  };
  let user = new users(userRecord).save();
  // let user = await  users.save(userRecord);
  let token= generateToken(user);
  console.log([user, token]);
  return [user, token];
}

