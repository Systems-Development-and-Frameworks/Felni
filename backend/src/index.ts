import { PostsDataSource } from './postsDataSource'
import { resolvers } from './resolvers'
import { typeDefs } from './typeDefs'
import { permissions } from './permissions'
import { createContext } from './context'
import { ApolloServer } from 'apollo-server'
import { v4 as uuidv4 } from 'uuid'
import { applyMiddleware } from 'graphql-middleware'
import { makeExecutableSchema } from 'graphql-tools'
const bcrypt = require('bcrypt')

// Initial data
const postData = [
  { id: uuidv4(), title: 'Item 1', votes: 0, voters: [], author: {} },
  { id: uuidv4(), title: 'Item 2', votes: 0, voters: [], author: {} }
]
const userData = [
  { id: uuidv4(), name: 'User 1', email: 'user1@example.org', password: bcrypt.hashSync('user1password', 10), posts: [postData[0]] },
  { id: uuidv4(), name: 'User 2', email: 'user2@example.org', password: bcrypt.hashSync('user2password', 10), posts: [postData[1]] }
]

postData[0].author = userData[0]
postData[1].author = userData[1]

const schema = makeExecutableSchema({ typeDefs, resolvers })

const server = new ApolloServer({
  schema: applyMiddleware(schema, permissions),
  context: createContext,
  dataSources: () => ({
    posts: new PostsDataSource(postData, userData)
  })
})

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`)
})
