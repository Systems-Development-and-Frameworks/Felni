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
import { augmentSchema } from "neo4j-graphql-js";
import neo4j from 'neo4j-driver';

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


// apparently with "makeExecutableSchema" we cannot use @relation(...) on our Typdefs
const schema = makeExecutableSchema({ typeDefs, resolvers })

// use augmentedSchema, not makeAugmentedSchema, to generate auto generated Mutations and Queries for our Types in schema
// but also use our resolvers and therefore also our postDataSource Methods with custom cypher code
// Query for "posts" would be "Post" (auto generated) now 
const augmentedSchema = augmentSchema(schema, {
  query: true,
  mutation: false // we define these by our custom cypher code, also we dont want relationship mutations
});

const driver = neo4j.driver(
  process.env.NEO4J_URI, // should be mentioned in the instructions
  neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD) // should be mentioned in the instructions
);

const server = new ApolloServer({
  // i hope this works, if not we have to use no auto generated queries or use "isAuthenticated" directive which
  // only works on Types and Fields not on Queries
  // or maybe use hasScope and graphql-auth-directives by attaching custom authorization schema directives
  schema: applyMiddleware(augmentedSchema, permissions), 
  context: { ...createContext, driver},
  dataSources: () => ({
    posts: new PostsDataSource(postData, userData)
  })
})

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`)
})
