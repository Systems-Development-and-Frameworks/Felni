import { PostsDataSource } from './postsDataSource'
import Resolvers from './resolvers'
import { typeDefs } from './typeDefs'
import { permissions } from './permissions'
import { createContext } from './context'
import { ApolloServer } from 'apollo-server'
import { v4 as uuidv4 } from 'uuid'
import { applyMiddleware } from 'graphql-middleware'
import { defaultMergedResolver, makeExecutableSchema, stitchSchemas } from 'graphql-tools'
import { hashSync } from 'bcrypt'
import { Post } from './post'
import { User } from './user'
import { augmentSchema, makeAugmentedSchema } from 'neo4j-graphql-js'
import { createDriverAndStuffDatabase } from './driver'

// apparently with "makeExecutableSchema" we cannot use @relation(...) on our Typdefs
// const schema = makeExecutableSchema({ typeDefs, resolvers })
const schema = makeAugmentedSchema({ typeDefs })
const resolvers = Resolvers({ subschema: schema })
const stichedSchema = stitchSchemas({
  subschemas: [schema],
  typeDefs,
  resolvers
})
// use augmentedSchema, not makeAugmentedSchema, to generate auto generated Mutations and Queries for our Types in schema
// but also use our resolvers and therefore also our postDataSource Methods with custom cypher code
// Query for "posts" would be "Post" (auto generated) now
// const augmentedSchema = augmentSchema(schema, {
//   query: true,
//   mutation: false // we define these by our custom cypher code, also we dont want relationship mutations
// })
const start = async () => {
  const driver = await createDriverAndStuffDatabase(false)
  const server = new ApolloServer({
    // i hope this works, if not we have to use no auto generated queries or use "isAuthenticated" directive which
    // only works on Types and Fields not on Queries
    // or maybe use hasScope and graphql-auth-directives by attaching custom authorization schema directives
    // schema: applyMiddleware(schema, permissions),
    schema: applyMiddleware(stichedSchema, permissions),
    context: { ...createContext, driver },
    dataSources: () => ({
      posts: new PostsDataSource()
    })
  })

  // The `listen` method launches a web server.
  server.listen().then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`)
  })
  // do stuff
}
start()
