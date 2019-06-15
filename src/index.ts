const { prisma } = require('./generated/prisma-client')
const { GraphQLServer } = require('graphql-yoga')
// const { jwtCheck } = require('./utils')
const Query = require('./resolvers/Query')
const Mutation = require('./resolvers/Mutation')
const dotenv = require('dotenv');
const cors = require('cors')
const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken');
const { getKey } = require('./utils')

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
// Set an HTTP cookie if we have a legit access token (jwt) that the browser can use
// to access the GraphQL API. For now, we'll just protect routes with the cookie.
// However in the future it makes sense to allow the cookie or the access token,
// for M2M auth and such.
function verifyJwt(token, response) {
  jwt.verify(
    token,
    getKey,
    { audience: 'https://knurling.api.com', issuer: 'https://knurling.auth0.com/' },
    function (err, decoded) {
      if (decoded) {
        console.log(decoded)
        response.cookie('token', token, { httpOnly: true, secure: process.env.APP_ENV === 'production' })
          .sendStatus(200);
      } else {
        response.status(401).json({ 'error': err });
      }
    })
}
server.express.options(process.env.CLIENT_URL, cors())
server.express.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
}))
server.express.use(cookieParser())

server.express.post('/authenticate', (req, res) => {
  const authorization = req.get('Authorization')
  if (authorization) {
    const token = req.get('Authorization').replace('Bearer ', '')
    if (token) {
      verifyJwt(token, res)
    } else {
      res.status(401).json({ 'error': 'No auth token provided' })
    }
  } else {
    res.status(401).json({ 'error': 'No auth token provided' })
  }
})

server.start(() => console.log(`Server is running on http://localhost:4000`))

