import { PostsDataSource } from './postsDataSource'
import { resolvers } from './resolvers'
import { typeDefs } from './typeDefs'
import { ApolloServer } from 'apollo-server'
import { v4 as uuidv4 } from 'uuid'

// Initial data
const postData = [
  { id: uuidv4(), title: 'Item 1', votes: 0, voters: [], author: { } },
  { id: uuidv4(), title: 'Item 2', votes: 0, voters: [], author: { } }
]
const userData = [
  { name: uuidv4(), posts: [postData[0]] },
  { name: uuidv4(), posts: [postData[1]] }
]

postData[0].author = userData[0]
postData[1].author = userData[1]

const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources: () => ({
    posts: new PostsDataSource(postData, userData)
  })
})

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`)
})
