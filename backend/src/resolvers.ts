// export const resolvers = {
//   // for Post and User we can -maybe- use default resolvers
//   Query: {
//     posts: (parent, { newsId }, context, info) => {
//       return context.dataSources.posts.getPosts()
//     },
//     users: (parent, { userId }, context, info) => {
//       return context.dataSources.posts.getUsers()
//     }
//   },
//   Mutation: {
//     write: (parent, { post }, context, info) => {
//       return context.dataSources.posts.addPost(post, context.decodedJwt.id)
//     },
//     upvote: (parent, { id, voter }, context, info) => {
//       return context.dataSources.posts.upvote(id, context.decodedJwt.id)
//     },
//     login: (parent, { email, password }, context, info) => {
//       return context.dataSources.posts.login(email, password)
//     },
//     signup: (parent, { name, email, password }, context, info) => {
//       return context.dataSources.posts.addUser(name, email, password)
//     }
//   }
// }

import { delegateToSchema } from 'graphql-tools'

export default ({ subschema }) => ({
  Query: {
    posts: async (parent, args, context, info) => {
      const post = await delegateToSchema({
        schema: subschema,
        operation: 'query',
        fieldName: 'Post',
        context,
        info
      })
      return post
    },
    users: async (parent, args, context, info) => {
      const user = await delegateToSchema({
        schema: subschema,
        operation: 'query',
        fieldName: 'User',
        context,
        info
      })
      return user
    }
  },
  Mutation: {
    signup: async (parent, { name, email, password }, context, info) => {
      return context.dataSources.posts.addUser(name, email, password, context.driver)
    },
    login: async (parent, { email, password }, context, info) => {
      return context.dataSources.posts.login(email, password, context.driver)
    }
  }
})
