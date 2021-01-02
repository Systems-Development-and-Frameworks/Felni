import Resolvers from './resolvers'
import { typeDefs } from './typeDefs'
import { permissions } from './permissions'
import { ApolloServer } from 'apollo-server'
import { ApolloServerTestClient, createTestClient } from 'apollo-server-testing'
import { applyMiddleware } from 'graphql-middleware'
import { stitchSchemas } from 'graphql-tools'
import { JWTSECRET } from './importSecret'
import { verify } from 'jsonwebtoken'
import { makeAugmentedSchema } from 'neo4j-graphql-js'
import { Neo4JDataSource } from './neo4jDataSource'
import { createDriverAndStuffDatabase } from './driver'

const testContext = (testToken, driver) => {
  let token = testToken || ''
  token = token.replace('Bearer ', '')
  try {
    const decodedJwt = verify(
      token,
      JWTSECRET
    )
    return { decodedJwt, driver }
  } catch (e) {
    return { driver }
  }
}
const schema = makeAugmentedSchema({ typeDefs })
const resolvers = Resolvers({ subschema: schema })
const stichedSchema = stitchSchemas({
  subschemas: [schema],
  typeDefs,
  resolvers
})
const dataSource = new Neo4JDataSource()
let driver
let testClient : ApolloServerTestClient
const setupServerAndReturnTestClient = async (testToken?) => {
  driver = await createDriverAndStuffDatabase(true)
  let server = await new ApolloServer({
    schema: applyMiddleware(stichedSchema, permissions),
    context: testContext(testToken, driver),
    dataSources: () => ({
      posts: dataSource
    })
  })
  testClient = createTestClient(server)
  if (testToken === 'valid') {
    const LOGIN = 'mutation {  login (email: "user1@example.org", password: "user1password") }'
    const res = await testClient.mutate({ mutation: LOGIN })
    server = await new ApolloServer({
      schema: applyMiddleware(stichedSchema, permissions),
      context: testContext(res.data.login, driver),
      dataSources: () => ({
        posts: dataSource
      })
    })
    testClient = createTestClient(server)
  }
}

describe('Test apollo server queries', () => {
  afterEach(() => {
    driver.close()
  })
  describe('Tests without token', () => {
    beforeEach(async () => {
      await setupServerAndReturnTestClient()
    })
    it('get all posts returns 1 post', async () => {
      const GET_POSTS = '{ posts { id votes }}'
      const res = await testClient.query({ query: GET_POSTS })
      expect(res.errors).toBeUndefined()
      expect(res.data.posts.length).toEqual(1)
      expect(res.data.posts[0].id).toEqual(expect.any(String))
      expect(res.data.posts[0].title).toBeUndefined()
    })

    it('queries are indefinitely nestable', async () => {
      const GET_POSTS = '{ posts { title author { name posts { title author { name }}}}}'
      const res = await testClient.query({ query: GET_POSTS })
      expect(res.errors).toBeUndefined()
      expect(res.data.posts[0].author.posts[0].author.name).toEqual('user1')
    })

    it('get all user return 1 user', async () => {
      const GET_USERS = '{ users { name }}'
      const res = await testClient.query({ query: GET_USERS })
      expect(res.errors).toBeUndefined()
      expect(res.data.users.length).toEqual(1)
      expect(res.data.users[0].name).toEqual('user1')
    })

    it('signup with password shorter than 8 characters return error', async () => {
      const SIGNUP = 'mutation {  signup (name: "testuser", email: "testuser@example.org", password: "short") }'
      const res = await testClient.mutate({ mutation: SIGNUP })
      expect(res.errors[0].message).toEqual('Password must have at least 8 characters')
      expect(res.data.signup).toBeNull()
    })

    it('signup with a valid password returns token', async () => {
      const SIGNUP = 'mutation {  signup (name: "testuser", email: "testuser@example.org", password: "password") }'
      const res = await testClient.mutate({ mutation: SIGNUP })
      expect(res.errors).toBeUndefined()
      expect(res.data.signup).toEqual(expect.any(String))
    })

    it('trying to signup the same user twice returns error the second time', async () => {
      const SIGNUP = 'mutation {  signup (name: "testuser", email: "testuser@example.org", password: "password") }'
      await testClient.mutate({ mutation: SIGNUP })
      const res = await testClient.mutate({ mutation: SIGNUP })
      expect(res.errors[0].message).toEqual('Email already taken by another user')
      expect(res.data.signup).toBeNull()
    })

    it('trying to login with invalid password returns error', async () => {
      const SIGNUP = 'mutation {  signup (name: "testuser", email: "testuser@example.org", password: "password") }'
      await testClient.mutate({ mutation: SIGNUP })
      const LOGIN = 'mutation {  login (email: "testuser@example.org", password: "invalid") }'
      const res = await testClient.mutate({ mutation: LOGIN })
      expect(res.errors[0].message).toEqual('Wrong email/password combination')
      expect(res.data.login).toBeNull()
    })

    it('trying to login with valid data returns token', async () => {
      const SIGNUP = 'mutation {  signup (name: "testuser", email: "testuser@example.org", password: "password") }'
      await testClient.mutate({ mutation: SIGNUP })
      const LOGIN = 'mutation {  login (email: "testuser@example.org", password: "password") }'
      const res = await testClient.mutate({ mutation: LOGIN })
      expect(res.errors).toBeUndefined()
      expect(res.data.login).toEqual(expect.any(String))
    })
  })

  describe('Tests with invalid token', () => {
    beforeEach(async () => {
      await setupServerAndReturnTestClient('invalid')
    })
    it('upvote a post with invalid token returns error', async () => {
      const UPVOTE = 'mutation { upvote(id: "post1") { votes }}'
      const res = await testClient.mutate({ mutation: UPVOTE })
      expect(res.errors.length).toEqual(1)
      expect(res.errors[0].message).toEqual('Not Authorised!')
    })
    it('add a post with invalid token returns error', async () => {
      const ADD_POST = 'mutation { write(post: { title: "TestTitle" }) { title author { name posts { title }}}}'
      const res = await testClient.mutate({ mutation: ADD_POST })
      expect(res.errors.length).toEqual(1)
      expect(res.errors[0].message).toEqual('Not Authorised!')
    })
  })

  describe('Tests with invalid token', () => {
    beforeEach(async () => {
      await setupServerAndReturnTestClient('valid')
    })

    it('upvote a post with valid token increases count', async () => {
      const UPVOTE = 'mutation { upvote(id: "post1id") { votes }}'
      const resUpvote = await testClient.mutate({ mutation: UPVOTE })
      expect(resUpvote.errors).toBeUndefined()
      expect(resUpvote.data.upvote.votes).toEqual(1)
    })

    it('upvote a post two times from the same user only upvotes the post once', async () => {
      const UPVOTE = 'mutation { upvote(id: "post1id") { votes }}'
      const resFirstUpvote = await testClient.mutate({ mutation: UPVOTE })
      expect(resFirstUpvote.errors).toBeUndefined()
      expect(resFirstUpvote.data.upvote.votes).toEqual(1)
      const resSecondUpvote = await testClient.mutate({ mutation: UPVOTE })
      expect(resSecondUpvote.errors).toBeUndefined()
      expect(resSecondUpvote.data.upvote.votes).toEqual(1)
    })

    it('add a post from an existing user adds the post to the user', async () => {
      const ADD_POST = 'mutation { write(post: { title: "TestTitle" }) { title author { name posts { title }}}}'
      const resAdd = await testClient.mutate({ mutation: ADD_POST })
      expect(resAdd.errors).toBeUndefined()
      expect(resAdd.data.write.title).toEqual('TestTitle')
      expect(resAdd.data.write.author.name).toEqual('user1')
      expect(resAdd.data.write.author.posts.length).toEqual(2)
    })
  })
})
