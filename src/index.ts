const { prisma } = require('./generated/prisma-client')
const { GraphQLServer } = require('graphql-yoga')
// const { jwtCheck } = require('./utils')
const Query = require('./resolvers/Query')
const Mutation = require('./resolvers/Mutation')
const dotenv = require('dotenv');
const cors = require('cors')
const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken');
const jwks = require('jwks-rsa');

dotenv.config();
// TODO: This whole file could use some TS types
const resolvers = {
  Query,
  Mutation,
}

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
  context: request => {
    return {
      ...request,
      prisma,
    }
  }
})

// TODO: Move this express middleware shit into a module?
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

// TODO: Add support to issue our own JWT rather than a cookie to give the option
// for nonbrowser clients to simply use JWTs
function verifyJwt(token, response) {
  jwt.verify(
    token,
    getKey,
    { audience: 'https://knurling.api.com', issuer: 'https://knurling.auth0.com/' },
    function (err, decoded) {
      if (decoded) {
        issueCookie(decoded, response)
      } else {
        authErrorResponse(response, err)
      }
    }
  )
}

function authErrorResponse(response, err) {
  response.status(401).json({ 'error': err })
}

function issueCookie(decoded, response) {
  response.cookie(
    'knurling.auth',
    decoded,
    { httpOnly: true, secure: process.env.APP_ENV === 'production', signed: true }
  ).sendStatus(200)
}
const corsOptions = {
  origin: process.env.CLIENT_URL,
  credentials: true,
}
server.express.use(cookieParser(process.env.APP_SECRET))
server.express.use(cors(corsOptions))

server.express.post('/authenticate', (req, res) => {
  const authorization = req.get('Authorization')
  if (authorization) {
    const token = req.get('Authorization').replace('Bearer ', '')
    if (token) {
      // Set an HTTP cookie if we have a legit access token (jwt) that the browser can use
      // to access the GraphQL API
      verifyJwt(token, res)
    } else {
      res.status(401).json({ 'error': 'No auth token provided' })
    }
  } else {
    res.status(401).json({ 'error': 'No auth token provided' })
  }
})

server.start({cors: false}, () => console.log(`Server is running on http://localhost:4000`))

