const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { APP_SECRET, getUserId } = require('../utils')

async function signup(parent, args, context) {
  const password = await bcrypt.hash(args.password, 10)
  const user = await context.prisma.createUser({...args, password})
  const token = jwt.sign({ userId: user.id }, APP_SECRET)

  return {
    token,
    user,
  }
}

async function meditation(parent, args, context) {
  // Just abusing this to ensure the user is authenticated right now
  // Will at some point add a created_by field to the Meditation records
  getUserId(context);

  const meditation = await context.prisma.createMeditation({
    title: args.title,
    description: args.description,
    url: args.url,
  })

  return meditation
}

module.exports = {
  signup,
  meditation,
}
