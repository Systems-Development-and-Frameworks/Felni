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
    write: async (parent, { post }, context, info) => {
      const createdPostId = await context.dataSources.posts.addPost(post, context.decodedJwt.id, context.driver)
      console.log(createdPostId)
      if (createdPostId) {
        const resolvedPost = await delegateToSchema({
          schema: subschema,
          operation: 'query',
          fieldName: 'Post',
          context,
          info
        })
        const newPost = await resolvedPost.find(post => post.id === createdPostId)
        return newPost
      }
      return null
    },
    login: async (parent, { email, password }, context, info) => {
      return context.dataSources.posts.login(email, password, context.driver)
    },
    signup: async (parent, { name, email, password }, context, info) => {
      return context.dataSources.posts.addUser(name, email, password, context.driver)
    }
  }
})
