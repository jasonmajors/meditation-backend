import { Context } from '../interfaces/Context'
import { User, Meditation } from '../generated/prisma-client'

const { authorizedUser } = require('../utils')

/**
 * Fetches the Users through the prisma API
 */
async function users(parent, args, context: Context) {
  // Enforce user is logged in
  authorizedUser(context);

  const users: User[] = await context.prisma.users()

  return users
}

/**
 * Fetches the Meditations through the prisma API
 */
async function meditations(parent, args, context: Context) {
  authorizedUser(context);

  const meditations: Meditation[] = await context.prisma.meditations()

  return meditations
}

module.exports = {
  users,
  meditations,
}
