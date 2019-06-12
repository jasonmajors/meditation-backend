const { prisma } = require('./generated/prisma-client')
const { GraphQLServer } = require('graphql-yoga')
const { jwtCheck } = require('./utils')
const Query = require('./resolvers/Query')
const Mutation = require('./resolvers/Mutation')
var cors = require('cors')

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
server.express.options('*', cors())
server.express.use(cors())
server.express.post(server.options.endpoint, jwtCheck)
server.start(() => console.log(`Server is running on http://localhost:4000`))

