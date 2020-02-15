'use strict';

const express = require('express');
const basicAuth = require('../auth/basic-auth-middleware.js');
// const model=require('../model/model.js');
const users = require('../auth/userModel.js');
// const mongoose = require('mongoose');
const oauth = require('../auth/Ouath-middleware.js');
const bearerOuth = require('../auth/bearer-auth.js');


const app = express();

app.use(express.json());
app.use(express.static('./public'));




app.post('/signup', (req, res) => {

  new users(req.body).save()
    .then((user) => {
      console.log('user',user);
      let token = user.generateToken();
      res.status(200).send(token);
    }).catch(err => console.error(err));
});

app.post('/signin',basicAuth, bearerOuth, (req, res) => {
  res.status(200).send(req.token);
});

app.get('/oauth', oauth, (req, res) => {
  res.status(200).send(req.token);
});

app.get('/secret', bearerOuth , (req ,res) =>{
  res.status(200).json(req.user);
});


module.exports = {
  server: app,
  start: port => {
    let PORT = port || process.env.PORT || 3000;
    app.listen(PORT, () => console.log('i am alive :', PORT));
  },
};