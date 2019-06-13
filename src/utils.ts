import { Context } from './interfaces/Context'

// const jwt = require('jsonwebtoken')
var jwt = require('express-jwt');
var jwks = require('jwks-rsa');

const dotenv = require('dotenv');

dotenv.config();

const APP_SECRET = process.env.APP_SECRET

const jwtCheck = jwt({
  secret: jwks.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: 'https://knurling.auth0.com/.well-known/jwks.json'
}),
  audience: 'https://knurling.api.com',
  issuer: 'https://knurling.auth0.com/',
  algorithms: ['RS256']
});

function hasPermission(context: Context, permission: string): boolean {

  return false;
}
function authorizedUser(context: Context) {
  // const Authorization = context.request.get('Authorization')
  // if (Authorization) {
  //   const token = Authorization.replace('Bearer ', '')
  //   const { userId } = jwt.verify(token, jwtCheck)

  //   return userId
  // }
  //throw new Error('Not authenticated')
}

module.exports = {
  APP_SECRET,
  authorizedUser,
  jwtCheck,
}
