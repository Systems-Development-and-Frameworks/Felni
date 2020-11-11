import { NewsListDB } from './newsListDB'
const { ApolloServer, gql } = require('apollo-server')

const typeDefs = gql`
  type Post {
    id: ID!
    title: String!
    votes: Int!
    author: User!
  }

  type User {
    name: ID!
    posts: [Post]
  }

  type Query {
    posts: [Post]
    users: [User]
  }

  type Mutation {
    write(post: PostInput!): Post
    # 🚀 OPTIONAL
    # delete(id: ID!): Post

    # ⚠️ FIXME in exercise #4
    # mock voter until we have authentication
    upvote(id: ID!, voter: UserInput!): Post

    # 🚀 OPTIONAL
    # downvote(id: ID!, voter: UserInput!): Post
  }

  input PostInput {
    title: String!

    # ⚠️ FIXME in exercise #4
    # mock author until we have authentication
    author: UserInput!
  }

  input UserInput {
    name: String!
  }
`

const resolvers = {
  // for Post and User we can -maybe- use default resolvers 
  Query: {
    posts: (parent, { newsId }, context, info) => {
      context.dataSources.newsList.getNews(newsId)
    },
    users: (parent, { userId }, context, info) => {
      context.dataSources.newsList.getUser(userId)
    }
  },
  Mutation: {
    write: (parent, { post }, context, info) => {
      return context.dataSources.newsList.addNews(post)
    },
    upvote: (parent, { newsId, voter }, context, info) => {
      return context.dataSources.newsList.upvote(newsId, voter)
    }
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources: () => ({
    newsList: new NewsListDB()
  })
})

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`)
})
