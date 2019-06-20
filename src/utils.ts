import { Context } from './interfaces/Context'

const dotenv = require('dotenv');
const APP_SECRET = process.env.APP_SECRET

dotenv.config();

function hasPermission(context: Context, permission: string): boolean {
  console.log('signed cookies: ', context.request.signedCookies)
  return false;
}

function authorizedUser(context: Context) {
  // const Authorization = context.request.get('Authorization')
  // if (Authorization) {
  //   const token = Authorization.replace('Bearer ', '')
  //   const { userId } = jwt.verify(token, jwtCheck)

  //   return userId
  // }
  //throw new Error('Not authenticated')
}

module.exports = {
  APP_SECRET,
  authorizedUser,
  hasPermission,
}
