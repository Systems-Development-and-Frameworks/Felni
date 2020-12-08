import { JWTSECRET } from './importSecret'
import { verify } from 'jsonwebtoken'

export function createContext ({ req }) {
  let token = req?.headers?.authorization || ''
  token = token.replace('Bearer ', '')
  try {
    const decodedJwt = verify(
      token,
      JWTSECRET
    )
    return { decodedJwt }
  } catch (e) {
    return {}
  }
}
