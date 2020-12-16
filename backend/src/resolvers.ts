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
    upvote: async (parent, { id }, context, info) => {
      return context.dataSources.posts.upvote(id, context.decodedJwt.id, context.driver)
    },
    login: async (parent, { email, password }, context, info) => {
      return context.dataSources.posts.login(email, password, context.driver)
    },
    signup: async (parent, { name, email, password }, context, info) => {
      return context.dataSources.posts.addUser(name, email, password, context.driver)
    }
  }
})
