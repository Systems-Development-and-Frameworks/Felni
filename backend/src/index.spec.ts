import Resolvers from './resolvers'
import { typeDefs } from './typeDefs'
import { permissions } from './permissions'
import { MemoryDataSource } from './memoryDataSource'
import { ApolloServer } from 'apollo-server'
import { createTestClient } from 'apollo-server-testing'
import { applyMiddleware } from 'graphql-middleware'
import { makeExecutableSchema } from 'graphql-tools'
import { JWTSECRET } from './importSecret'
import { hashSync } from 'bcrypt'
import { verify } from 'jsonwebtoken'
import { Post } from './post'
import { User } from './user'
import { stitchSchemas } from 'graphql-tools'
import { makeAugmentedSchema } from 'neo4j-graphql-js'

let posts
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
const resolvers = Resolvers({ subschema: null })
const stichedSchema = stitchSchemas({
  subschemas: [schema],
  typeDefs,
  resolvers
})

const setupServerAndReturnTestClient = (postDataSource, testToken?) => {
  //const resolvers = Resolvers({ subschema: null })
  //const schema = makeExecutableSchema({ typeDefs, resolvers })
  const server = new ApolloServer({
    schema: applyMiddleware(stichedSchema, permissions),
    context: testContext(testToken, null), // not sure if this is the correct way. but we didn`t find another solution to add the token as request (see https://github.com/apollographql/apollo-server/issues/2277)
    dataSources: () => ({
      posts: postDataSource
    })
  })
  return createTestClient(server)
}

describe('Test apollo server queries', () => {
  beforeEach(() => {
    const postData = [new Post('post1', 'Item1')]
    const userData = [new User('userid1', 'user1', 'user1@example.org', hashSync('user1password', 10))]
    postData[0].author = userData[0]
    userData[0].posts.push(postData[0])
    posts = new MemoryDataSource(postData, userData)
  })
  it('get all posts returns 1 post', async () => {
    const { query } = setupServerAndReturnTestClient(posts)
    const GET_POSTS = '{ posts { id votes }}'
    const res = await query({ query: GET_POSTS })
    expect(res.errors).toBeUndefined()
    expect(res.data.posts.length).toEqual(1)
    expect(res.data.posts[0].id).toEqual('post1')
    expect(res.data.posts[0].title).toBeUndefined()
  })

  it('queries are indefinitely nestable', async () => {
    const { query } = setupServerAndReturnTestClient(posts)
    const GET_POSTS = '{ posts { title author { name posts { title author { name }}}}}'
    const res = await query({ query: GET_POSTS })
    expect(res.errors).toBeUndefined()
    expect(res.data.posts[0].author.posts[0].author.name).toEqual('user1')
  })

  it('get all user return 1 user', async () => {
    const { query } = setupServerAndReturnTestClient(posts)
    const GET_USERS = '{ users { name }}'
    const res = await query({ query: GET_USERS })
    expect(res.errors).toBeUndefined()
    expect(res.data.users.length).toEqual(1)
    expect(res.data.users[0].name).toEqual('user1')
  })

  it('upvote a post with invalid token returns error', async () => {
    const { mutate } = setupServerAndReturnTestClient(posts, 'invalidToken')
    const UPVOTE = 'mutation { upvote(id: "post1") { votes }}'
    const res = await mutate({ mutation: UPVOTE })
    expect(res.errors.length).toEqual(1)
    expect(res.errors[0].message).toEqual('Not Authorised!')
  })

  it('upvote a post with valid token increases count', async () => {
    let client = setupServerAndReturnTestClient(posts)
    const LOGIN = 'mutation {  login (email: "user1@example.org", password: "user1password") }'
    const res = await client.mutate({ mutation: LOGIN })
    console.log(res);
    client = setupServerAndReturnTestClient(posts, res.data.login)
    const UPVOTE = 'mutation { upvote(id: "post1") { votes }}'
    const resUpvote = await client.mutate({ mutation: UPVOTE })
    expect(resUpvote.errors).toBeUndefined()
    expect(resUpvote.data.upvote.votes).toEqual(1)
  })

  it('upvote a post two times from the same user only upvotes the post once', async () => {
    let client = setupServerAndReturnTestClient(posts)
    const LOGIN = 'mutation {  login (email: "user1@example.org", password: "user1password") }'
    const res = await client.mutate({ mutation: LOGIN })

    client = setupServerAndReturnTestClient(posts, res.data.login)
    const UPVOTE = 'mutation { upvote(id: "post1") { votes }}'
    const resFirstUpvote = await client.mutate({ mutation: UPVOTE })
    expect(resFirstUpvote.errors).toBeUndefined()
    expect(resFirstUpvote.data.upvote.votes).toEqual(1)
    const resSecondUpvote = await client.mutate({ mutation: UPVOTE })
    expect(resSecondUpvote.errors).toBeUndefined()
    expect(resSecondUpvote.data.upvote.votes).toEqual(1)
  })

  it('add a post with invalid token returns error', async () => {
    const { mutate } = setupServerAndReturnTestClient(posts, 'invalidToken')
    const ADD_POST = 'mutation { write(post: { title: "TestTitle" }) { title author { name posts { title }}}}'
    const res = await mutate({ mutation: ADD_POST })
    expect(res.errors.length).toEqual(1)
    expect(res.errors[0].message).toEqual('Not Authorised!')
  })

  it('add a post from an existing user adds the post to the user', async () => {
    let client = setupServerAndReturnTestClient(posts)
    const LOGIN = 'mutation {  login (email: "user1@example.org", password: "user1password") }'
    const res = await client.mutate({ mutation: LOGIN })

    client = setupServerAndReturnTestClient(posts, res.data.login)
    const ADD_POST = 'mutation { write(post: { title: "TestTitle" }) { title author { name posts { title }}}}'
    const resAdd = await client.mutate({ mutation: ADD_POST })
    expect(resAdd.errors).toBeUndefined()
    expect(resAdd.data.write.title).toEqual('TestTitle')
    expect(resAdd.data.write.author.name).toEqual('user1')
    expect(resAdd.data.write.author.posts.length).toEqual(2)
  })

  it('signup with password shorter than 8 characters return error', async () => {
    const { mutate } = setupServerAndReturnTestClient(posts)
    const SIGNUP = 'mutation {  signup (name: "testuser", email: "testuser@example.org", password: "short") }'
    const res = await mutate({ mutation: SIGNUP })
    expect(res.errors[0].message).toEqual('Not Authorised!')
    expect(res.data.signup).toBeNull()
  })

  it('signup with a valid password returns token', async () => {
    const { mutate } = setupServerAndReturnTestClient(posts)
    const SIGNUP = 'mutation {  signup (name: "testuser", email: "testuser@example.org", password: "password") }'
    const res = await mutate({ mutation: SIGNUP })
    expect(res.errors).toBeUndefined()
    expect(res.data.signup).toEqual(expect.any(String))
  })

  it('trying to signup the same user twice returns error the second time', async () => {
    const { mutate } = setupServerAndReturnTestClient(posts)
    const SIGNUP = 'mutation {  signup (name: "testuser", email: "testuser@example.org", password: "password") }'
    await mutate({ mutation: SIGNUP })
    const res = await mutate({ mutation: SIGNUP })
    expect(res.errors[0].message).toEqual('Not Authorised!')
    expect(res.data.signup).toBeNull()
  })

  it('trying to login with invalid password returns error', async () => {
    const { mutate } = setupServerAndReturnTestClient(posts)
    const SIGNUP = 'mutation {  signup (name: "testuser", email: "testuser@example.org", password: "password") }'
    await mutate({ mutation: SIGNUP })
    const LOGIN = 'mutation {  login (email: "testuser@example.org", password: "invalid") }'
    const res = await mutate({ mutation: LOGIN })
    expect(res.errors[0].message).toEqual('Not Authorised!')
    expect(res.data.login).toBeNull()
  })

  it('trying to login with valid data returns token', async () => {
    const { mutate } = setupServerAndReturnTestClient(posts)
    const SIGNUP = 'mutation {  signup (name: "testuser", email: "testuser@example.org", password: "password") }'
    await mutate({ mutation: SIGNUP })
    const LOGIN = 'mutation {  login (email: "testuser@example.org", password: "password") }'
    const res = await mutate({ mutation: LOGIN })
    expect(res.errors).toBeUndefined()
    expect(res.data.login).toEqual(expect.any(String))
  })
})
