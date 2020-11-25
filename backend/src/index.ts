import { PostsDataSource } from './postsDataSource'
import { resolvers } from './resolvers'
import { typeDefs } from './typeDefs'
import { ApolloServer } from 'apollo-server'
import { v4 as uuidv4 } from 'uuid'
import { applyMiddleware } from 'graphql-middleware'
import { rule, shield, deny, allow} from 'graphql-shield'
import { makeExecutableSchema } from 'graphql-tools'

const jwt = require('jsonwebtoken')
require('dotenv').config()

// Initial data
const postData = [
  { id: uuidv4(), title: 'Item 1', votes: 0, voters: [], author: {} },
  { id: uuidv4(), title: 'Item 2', votes: 0, voters: [], author: {} }
]
const userData = [
  { id: uuidv4(), name: 'User 1', email: 'user1@example.org', password: '', posts: [postData[0]] },
  { id: uuidv4(), name: 'User 2', email: 'user2@example.org', password: '', posts: [postData[1]] }
]

postData[0].author = userData[0]
postData[1].author = userData[1]

function createContext({ req }) {
  let token = req.headers.authorization || ''
  token = token.replace('Bearer ', '')
  try {
    const decodedJwt = jwt.verify(
      token,
      process.env.JWTSECRET
    )
    return { decodedJwt }
  } catch (e) {
    return {}
  }
}

const isAuthenticated = rule({ cache: 'contextual' })(
  async (parent, args, context, info) => {
    return !!context.dataSources.posts.getUsers((user => user.id === context.decodedJwt.payload.id))
  },
)

const permissions = shield({
  Query: {
    '*': deny,
    posts: allow,
    users: allow
  },
  Mutation: {
    '*': deny,
    login: allow,
    signup: allow,
    write: isAuthenticated,
    upvote: isAuthenticated
  }
});

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
