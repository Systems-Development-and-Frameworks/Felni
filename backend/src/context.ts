import { JWTSECRET } from './importSecret'
import { verify } from 'jsonwebtoken'

export function createContext (req, driver) {
  let token = req?.headers?.authorization || ''
  token = token.replace('Bearer ', '')
  try {
    const decodedJwt = verify(
      token,
      JWTSECRET
    )
    return { decodedJwt, driver } // i think req is required for the middleware permissions to work
  } catch (e) {
    return { driver }
  }
}
