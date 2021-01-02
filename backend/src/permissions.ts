import { rule, shield, deny, allow } from 'graphql-shield'

const isAuthenticated = rule({ cache: 'contextual' })(
  async (parent, args, context, info) => {
    const session = context.driver.session()
    const txc = session.beginTransaction()
    let userExist = false
    await txc.run('MATCH (n:User) WHERE n.id = $id RETURN n', {
      id: context.decodedJwt.id
    }).then(result => {
      userExist = !(result.records.length === 0)
    })
    return userExist
  }
)

export const permissions = shield({
  Query: {
    posts: allow,
    users: allow,
    '*': deny
  },
  Mutation: {
    write: isAuthenticated,
    upvote: isAuthenticated,
    login: allow,
    signup: allow,
    '*': deny
  },
  Post: allow,
  User: allow
}, { allowExternalErrors: true })
