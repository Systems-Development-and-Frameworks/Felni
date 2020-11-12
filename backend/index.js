import { PostsDataSource } from './postsDataSource.js'
import pkg from 'apollo-server'
import crypto from 'crypto'
const { ApolloServer, gql } = pkg

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
    upvote: (parent, { newsId, voter }, context, info) => {
      return context.dataSources.posts.upvote(newsId, voter)
    }
  }
}

const items = [
  { id: crypto.randomBytes(16).toString('hex'), title: 'Item 1', votes: 0, author: { name: crypto.randomBytes(16).toString('hex'), posts: [] } },
  { id: crypto.randomBytes(16).toString('hex'), title: 'Item 2', votes: 0, author: { name: crypto.randomBytes(16).toString('hex'), posts: [] } }
]
items[0].author.posts.push(items[0])
items[1].author.posts.push(items[1])

const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources: () => ({
    posts: new PostsDataSource(items)
  })
})

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`)
})
