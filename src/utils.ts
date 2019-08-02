import { Context } from './interfaces/Context'

const dotenv = require('dotenv');
const APP_SECRET = process.env.APP_SECRET

dotenv.config();

function hasPermission(context: Context, permission: string): boolean {
  const cookies = context.request.signedCookies['knurling.auth']
  let permissions = []
  if (cookies && 'permissions' in cookies) {
    permissions = cookies.permissions
  }
  return permissions.includes(permission)
}

function mustHavePermission(context: Context, permission: string): void {
  // for dev without login
  // return
  if (hasPermission(context, permission) === false) {
    throw new Error('Unauthorized')
  }
}

module.exports = {
  APP_SECRET,
  mustHavePermission,
}
