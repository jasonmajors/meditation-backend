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

  const meditations: Meditation[] = await context.prisma.meditations({
    orderBy: args.orderBy
  })

  return meditations
}

/**
 * Fetches a single meditation record from prisma
 */
async function meditation(parent, args, context: Context) {
  authorizedUser(context);

  const meditation: Meditation = await context.prisma.meditation({
    id: args.id
  })

  return meditation
}

module.exports = {
  users,
  meditations,
  meditation,
}
