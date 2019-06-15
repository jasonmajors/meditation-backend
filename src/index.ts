const { prisma } = require('./generated/prisma-client')
const { GraphQLServer } = require('graphql-yoga')
// const { jwtCheck } = require('./utils')
const Query = require('./resolvers/Query')
const Mutation = require('./resolvers/Mutation')
const dotenv = require('dotenv');
const cors = require('cors')
const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken');
const { verifyJwt, getKey } = require('./utils')

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
function authErrorResponse(response, err) {
  response.status(401).json({ 'error': err })
}

function issueCookie(token, response) {
  response.cookie('token', token, { httpOnly: true, secure: process.env.APP_ENV === 'production' })
    .sendStatus(200)
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
      // Set an HTTP cookie if we have a legit access token (jwt) that the browser can use
      // to access the GraphQL API
      verifyJwt(token, issueCookie, authErrorResponse, res)
    } else {
      res.status(401).json({ 'error': 'No auth token provided' })
    }
  } else {
    res.status(401).json({ 'error': 'No auth token provided' })
  }
})

server.start(() => console.log(`Server is running on http://localhost:4000`))

