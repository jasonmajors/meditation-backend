const { prisma } = require('./generated/prisma-client')
const { GraphQLServer } = require('graphql-yoga')

const Query = require('./resolvers/Query')

const resolvers = {
  Query,
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
server.start(() => console.log(`Server is running on http://localhost:4000`))

