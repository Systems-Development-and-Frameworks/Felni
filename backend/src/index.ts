import { Neo4JDataSource } from './neo4jDataSource'
import Resolvers from './resolvers'
import { typeDefs } from './typeDefs'
import { permissions } from './permissions'
import { createContext } from './context'
import { ApolloServer } from 'apollo-server'
import { applyMiddleware } from 'graphql-middleware'
import { stitchSchemas } from 'graphql-tools'
import { makeAugmentedSchema } from 'neo4j-graphql-js'
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
    schema: applyMiddleware(stichedSchema, permissions),
    context: ({ req }) => {
      return createContext(req, driver)
    },
    dataSources: () => ({
      posts: new Neo4JDataSource()
    })
  })

  // The `listen` method launches a web server.
  server.listen().then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`)
  })
}
start()
