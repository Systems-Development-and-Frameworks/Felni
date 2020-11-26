const jwt = require('jsonwebtoken')
require('dotenv').config()

export function createContext ({ req }) {
  let token = req?.headers?.authorization || ''
  token = token.replace('Bearer ', '')
  try {
    const decodedJwt = jwt.verify(
      token,
      process.env.JWTSECRET
    )
    return { decodedJwt }
  } catch (e) {
    return {}
  }
}
