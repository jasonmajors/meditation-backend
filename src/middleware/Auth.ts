
const cors = require('cors')
const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken')
const jwks = require('jwks-rsa')
const dotenv = require('dotenv')

dotenv.config();
// TODO: Move these strings into .env
export class Auth {
  getKey(header, callback) {
    const client = jwks({
      jwksUri: 'https://knurling.auth0.com/.well-known/jwks.json'
    });

    client.getSigningKey(header.kid, function(err, key) {
      var signingKey = key.publicKey || key.rsaPublicKey;
      callback(null, signingKey);
    });
  }
  // TODO: Add support to issue our own JWT rather than a cookie to give the option
  // for nonbrowser clients to simply use JWTs
  verifyJwt(token, response) {
    jwt.verify(
      token,
      this.getKey,
      { audience: 'https://knurling.api.com', issuer: 'https://knurling.auth0.com/' },
      (err, decoded) => {
        if (decoded) {
          console.log("User ID: ", decoded.sub)
          // TODO: Temporary hack until I can figure out how to do this in Auth0...
          if (decoded.permissions.includes('read:meditations') === false) {
            decoded.permissions.push('read:meditations');
          }
          console.log(decoded)
          this.issueCookie(decoded, response)
        } else {
          this.authErrorResponse(response, err)
        }
      }
    )
  }

  authErrorResponse(response, err) {
    response.status(401).json({ 'error': err })
  }

  issueCookie(decoded, response) {
    response.cookie(
      'knurling.auth',
      decoded,
      { httpOnly: true, secure: process.env.APP_ENV === 'production', signed: true }
    ).sendStatus(200)
  }

  setCorsPolicy(server) {
    const corsOptions = {
      origin: process.env.CLIENT_URL,
      credentials: true,
    }
    server.express.use(cookieParser(process.env.APP_SECRET))
    server.express.use(cors(corsOptions))

    return server
  }

  setAuthenticateRoute(server) {
    server.express.post('/authenticate', (req, res) => {
      const authorization = req.get('Authorization')
      if (authorization) {
        const token = req.get('Authorization').replace('Bearer ', '')
        if (token) {
          // Set an HTTP cookie if we have a legit access token (jwt) that the browser can use
          // to access the GraphQL API
          this.verifyJwt(token, res)
        } else {
          res.status(401).json({ 'error': 'No auth token provided' })
        }
      } else {
        res.status(401).json({ 'error': 'No auth token provided' })
      }
    })

    return server
  }
}





