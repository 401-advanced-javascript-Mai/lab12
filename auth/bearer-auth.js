
const users = require('./userModel.js');

module.exports = (req, res, next) => {

  console.log('req.headers.authorization' , req.headers.authorization);
  let token;

  if (!req.headers.authorization) { next('invalid login'); }

  if ( req.token){ token = req.token ;
    console.log ('mai token');}
  else {

    token = req.headers.authorization.split(' ').pop();
  }

  users.authenticateToken(token)
    .then(validUser => {
      console.log('valid user ' , validUser);
        
      req.user = validUser;
      next();
    }).catch(err => next(err));
};