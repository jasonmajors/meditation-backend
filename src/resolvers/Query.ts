import { Context } from '../interfaces/Context'
import { User, Meditation } from '../generated/prisma-client'

const { mustHavePermission } = require('../utils')

/**
 * Fetches the Users through the prisma API
 * @todo Need to figure out how/if we want to store users now that we're using auth0
 */
async function users(parent, args, context: Context) {
  // TODO: If we store users, we'll need to setup read:users on Auth0
  mustHavePermission(context, 'read:users')

  const users: User[] = await context.prisma.users()

  return users
}

/**
 * Fetches the Meditations through the prisma API
 */
async function meditations(parent, args, context: Context) {
  mustHavePermission(context, 'read:meditations')

  const meditations: Meditation[] = await context.prisma.meditations({
    orderBy: args.orderBy
  })

  return meditations
}

/**
 * Fetches a single meditation record from prisma
 */
async function meditation(parent, args, context: Context) {
  mustHavePermission(context, 'read:meditations')

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
