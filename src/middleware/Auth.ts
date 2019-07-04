
const cors = require('cors')
const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken')
const jwks = require('jwks-rsa')
const dotenv = require('dotenv')
const multer  = require('multer')
const axios = require('axios');
const FormData = require('form-data');
const rp = require('request-promise');
const { handleFetchErrors } = require('../utils')

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

    var upload = multer()
    var mediaUpload = upload.fields([{ name: 'image', maxCount: 1 }, { name: 'audio', maxCount: 1 }])

    server.express.post('/media', mediaUpload, (req, res, next) => {
      const { files } = req
      const { buffer: imgBuffer, originalname: filename } = files['image'][0];
      const { buffer: audioBuffer, originalname: audioFilename } = files['audio'][0];

      const formFile = new FormData();

      formFile.append('image', imgBuffer, filename);
      // TODO: Testing error handling.. needs to be "audio" to work
      formFile.append('audi', audioBuffer, audioFilename);

      fetch('https://media-upload-microservice.herokuapp.com/upload?token=s3cr3t', {
        method: 'POST',
        body: formFile
      })
      .then(handleFetchErrors)
      .then(response => {
        console.log("Media uploaded")
        console.log('Success:', JSON.stringify(response))
        // TODO: Need to return a success response somehow
      })
      .catch(error => {
        // TODO: Need to get the http status code from the go server
        // res.status(400).json({ 'error': error })
      });

      console.log(req.signedCookies)
      // will need to get the files and send to the upload service
      // res.status(403).json({ 'error': 'Unauthorized' })
    })

    return server
  }
}





