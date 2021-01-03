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
      const returnedPost = await context.dataSources.posts.addPost(post, context.decodedJwt.id, context.driver)
      if (returnedPost) {
        const resolvedPost = await delegateToSchema({
          schema: subschema,
          operation: 'query',
          fieldName: 'Post',
          context,
          args: { id: returnedPost.id },
          info
        })
        if (resolvedPost.length) {
          return resolvedPost[0]
        }
        return null
      }
      return null
    },
    upvote: async (parent, { id }, context, info) => {
      const returnedPost = await context.dataSources.posts.upvote(id, context.decodedJwt.id, context.driver)
      if (returnedPost) {
        const resolvedPost = await delegateToSchema({
          schema: subschema,
          operation: 'query',
          fieldName: 'Post',
          context,
          args: { id: returnedPost.id },
          info
        })
        if (resolvedPost.length) {
          return resolvedPost[0]
        }
        return null
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
