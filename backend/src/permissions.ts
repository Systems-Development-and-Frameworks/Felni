import { rule, shield, deny, allow } from 'graphql-shield'

const isAuthenticated = rule({ cache: 'contextual' })(
  async (parent, args, context, info) => {
    return await context.dataSources.posts.existsUser(context.decodedJwt.id)
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
})
