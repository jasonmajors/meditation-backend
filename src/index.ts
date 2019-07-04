const { prisma } = require('./generated/prisma-client')
const { GraphQLServer } = require('graphql-yoga')
const Query = require('./resolvers/Query')
const Mutation = require('./resolvers/Mutation')
const { Auth } = require('./middleware/Auth')

// TODO: This whole file could use some TS types
const resolvers = {
  Query,
  Mutation,
}

let server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
  context: request => {
    return {
      ...request,
      prisma,
    }
  }
})

const auth = new Auth()
// TODO: Could be cleaner but whatever
server = auth.setCorsPolicy(server)
server = auth.setAuthenticateRoute(server)

// server.express.post('/media', function(req, res) {
//   console.log(req.body)
//   // TODO: Read cookie, check if has correct permissions
//   console.log(req.signedCookies);
//   // will need to get the files and send to the upload service
//   res.status(403).json({ 'error': 'Unauthorized' })
// })

server.start({cors: false}, () => console.log(`Server is running on http://localhost:4000`))

