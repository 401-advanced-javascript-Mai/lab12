'use strict';
require('dotenv').config();
const server = require ('./src/server.js');  
const mongoose = require ('mongoose');

const mongooseOptions = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
};
mongoose.connect( process.env.MONGOOSE_URI , mongooseOptions);

server.start(process.env.PORT);