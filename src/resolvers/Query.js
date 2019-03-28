async function users(parent, args, context) {
  const users = await context.prisma.users();

  return users;
}

module.exports = {
  users,
}
