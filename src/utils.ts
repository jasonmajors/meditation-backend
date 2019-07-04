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
  if (hasPermission(context, permission) === false) {
    throw new Error('Unauthorized')
  }
}

function handleFetchErrors(response) {
  if (!response.ok) {
    throw Error(response.statusText);
  }
  return response.json();
}

module.exports = {
  APP_SECRET,
  mustHavePermission,
  handleFetchErrors,
}
