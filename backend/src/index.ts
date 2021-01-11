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

const schema = makeAugmentedSchema({ typeDefs })
const resolvers = Resolvers({ subschema: schema })
const stichedSchema = stitchSchemas({
  subschemas: [schema],
  typeDefs,
  resolvers
})

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
