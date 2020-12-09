import { PostsDataSource } from './postsDataSource'
import { resolvers } from './resolvers'
import { typeDefs } from './typeDefs'
import { permissions } from './permissions'
import { createContext } from './context'
import { ApolloServer } from 'apollo-server'
import { v4 as uuidv4 } from 'uuid'
import { applyMiddleware } from 'graphql-middleware'
import { makeExecutableSchema } from 'graphql-tools'
import { hashSync } from 'bcrypt'
import { Post } from './post'
import { User } from './user'

// Initial data
const postData = [
  new Post(uuidv4(), 'Item1'),
  new Post(uuidv4(), 'Item2')
]
const userData = [
  new User(uuidv4(), 'User1', 'user1@example.org', hashSync('user1password', 10)),
  new User(uuidv4(), 'User2', 'user2@example.org', hashSync('user2password', 10))
]
userData[0].posts.push(postData[0])
userData[1].posts.push(postData[1])
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
