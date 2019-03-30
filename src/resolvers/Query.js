/**
 * Fetches the Users through the prisma API
 */
async function users(parent, args, context) {
  const users = await context.prisma.users()

  return users
}

/**
 * Fetches the Meditations through the prisma API
 */
async function meditations(parent, args, context) {
  const meditations = await context.prisma.meditations()

  return meditations
}

module.exports = {
  users,
  meditations,
}
