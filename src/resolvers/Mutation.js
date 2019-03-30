const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { APP_SECRET, getUserId } = require('../utils')

/**
 * The resolver for the signup mutation
 */
async function signup(parent, args, context) {
  const password = await bcrypt.hash(args.password, 10)
  const user = await context.prisma.createUser({...args, password})
  const token = jwt.sign({ userId: user.id }, APP_SECRET)

  return {
    token,
    user,
  }
}

/**
 * The resolver for the login mutation
 */
async function login(parent, args, context) {
  const AUTH_ERROR = `Invalid credentials`
  const user = await context.prisma.user({ email: args.email });
  if (!user) {
    throw new Error(AUTH_ERROR);
  }

  const valid = await bcrypt.compare(args.password, user.password)
  if (!valid) {
    throw new Error(AUTH_ERROR)
  }

  const token = jwt.sign({ userId: user.id }, APP_SECRET)

  return {
    token,
    user,
  }
}

/**
 * The resolver for the meditation mutation
 */
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
  login,
  meditation,
}
