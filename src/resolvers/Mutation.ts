import { Context } from '../interfaces/Context'
import { LoginMutationInput } from '../interfaces/LoginMutationInput'
import {
  User,
  Meditation,
  UserCreateInput,
  MeditationCreateInput,
 } from '../generated/prisma-client'

const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { APP_SECRET, authorizedUser } = require('../utils')

/**
 * The resolver for the signup mutation
 */
async function signup(parent, args: UserCreateInput, context: Context) {
  const password: string = await bcrypt.hash(args.password, 10)
  const user: User = await context.prisma.createUser({...args, password})
  const token: string = jwt.sign({ userId: user.id }, APP_SECRET)

  return {
    token,
    user,
  }
}

/**
 * The resolver for the login mutation
 */
async function login(parent, args: LoginMutationInput, context: Context) {
  const AUTH_ERROR: string = `Invalid credentials`
  const user: User = await context.prisma.user({ email: args.email });
  if (!user) {
    throw new Error(AUTH_ERROR);
  }

  const valid: boolean = await bcrypt.compare(args.password, user.password)
  if (!valid) {
    throw new Error(AUTH_ERROR)
  }

  const token: string = jwt.sign({ userId: user.id }, APP_SECRET)

  return {
    token,
    user,
  }
}

/**
 * The resolver for the meditation mutation
 */
async function meditation(parent, args: MeditationCreateInput, context: Context) {
  // Just abusing this to ensure the user is authenticated right now
  // Will at some point add a created_by field to the Meditation records
  authorizedUser(context);

  const meditation: Meditation = await context.prisma.createMeditation({
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
