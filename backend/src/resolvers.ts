export const resolvers = {
  // for Post and User we can -maybe- use default resolvers
  Query: {
    posts: (parent, { newsId }, context, info) => {
      return context.dataSources.posts.getPosts()
    },
    users: (parent, { userId }, context, info) => {
      return context.dataSources.posts.getUsers()
    }
  },
  Mutation: {
    write: (parent, { post }, context, info) => {
      return context.dataSources.posts.addPost(post)
    },
    upvote: (parent, { id, voter }, context, info) => {
      return context.dataSources.posts.upvote(id, voter)
    },
    signup: (parent, { name, email, password }, context, info) => {
      return context.dataSources.posts.addUser(name, email, password)
    },
    login: (parent, { email, password }, context, info) => {
      return context.dataSources.posts.login(email, password)
    }
  }
}
