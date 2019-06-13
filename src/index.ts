const { prisma } = require('./generated/prisma-client')
const { GraphQLServer } = require('graphql-yoga')
const { jwtCheck } = require('./utils')
const Query = require('./resolvers/Query')
const Mutation = require('./resolvers/Mutation')
const dotenv = require('dotenv');
var cors = require('cors')

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
server.express.options(process.env.API_URL, cors())
// Not doing shit
server.express.use(cors({
  origin: process.env.API_URL,
  credentials: true,
}))
// Set an HTTP cookie if the request came from a legit access token (jwt) for
// the browser to access the GraphQL API. For now, we'll just protect routes with the cookie.
// However in the future it makes sense to allow the cookie or the access token,
// for M2M auth and such.
server.express.post('/authenticate', jwtCheck, (req, res, next) => {
  if (req.user) {
    console.log(req.user)
    res.cookie('token', req.user, { httpOnly: true, secure: process.env.APP_ENV === 'production' })
      .sendStatus(200);
  }
})
server.express.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.status(401).json({ 'error': 'invalid token...' });
  }
});
// server.express.post(server.options.endpoint, jwtCheck)
server.start(() => console.log(`Server is running on http://localhost:4000`))

