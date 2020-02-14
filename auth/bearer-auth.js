
const users = require('./userModel.js');

module.exports = (req, res, next) => {
    console.log('req.headers.authorization' , req.headers.authorization)
  if (!req.headers.authorization) { next('invalid login') }

  let token = req.headers.authorization.split(' ').pop();
  

  users.authenticateToken(token)
    .then(validUser => {
        console.log('valid user ' , validUser);
        
      req.user = validUser;
      next();
    }).catch(err => next(err));
}