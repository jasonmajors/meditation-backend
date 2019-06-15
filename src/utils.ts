import { Context } from './interfaces/Context'
// const jwt = require('jsonwebtoken')
// var jwt = require('express-jwt');
const jwks = require('jwks-rsa');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const APP_SECRET = process.env.APP_SECRET

dotenv.config();
// TODO: Move strings to env and typescript types would be nice
function getKey(header, callback) {
  const client = jwks({
    jwksUri: 'https://knurling.auth0.com/.well-known/jwks.json'
  });

  client.getSigningKey(header.kid, function(err, key) {
    var signingKey = key.publicKey || key.rsaPublicKey;
    callback(null, signingKey);
  });
}
// Set an HTTP cookie if we have a legit access token (jwt) that the browser can use
// to access the GraphQL API. For now, we'll just protect routes with the cookie.
// However in the future it makes sense to allow the cookie or the access token,
// for M2M auth and such.

// TODO: Maybe take req into here too? Could handle all error responding in here
// and could also check
function verifyJwt(token, response) {
  jwt.verify(
    token,
    getKey,
    {audience: 'https://knurling.api.com', issuer: 'https://knurling.auth0.com/'},
    function(err, decoded) {
      if (decoded) {
        console.log(decoded)
        response.cookie('token', token, { httpOnly: true, secure: process.env.APP_ENV === 'production' })
          .sendStatus(200);
      } else {
        // parse a response err
      }
  })
}

function hasPermission(context: Context, permission: string): boolean {
  // TODO: Read the fucking cookie
  // If we make the cookie hold the JWT, can use the old jwt.verify with a function to validate the signature
  // Should do the above one
  // Or can just use the current jwtCheck maybe without the rateLimit
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
  hasPermission,
  // jwtCheck,
  getKey
}
