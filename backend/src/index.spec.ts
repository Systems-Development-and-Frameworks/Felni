import { resolvers } from './resolvers'
import { typeDefs } from './typeDefs'
import { permissions } from './permissions'
import { PostsDataSource } from './postsDataSource'
import { ApolloServer } from 'apollo-server'
import { createTestClient } from 'apollo-server-testing'
import { applyMiddleware } from 'graphql-middleware'
import { makeExecutableSchema } from 'graphql-tools'
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const testContext = (testToken?) => {
  let token = testToken || ''
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
const setupServer = (postData, userData, testToken?) => {
  const schema = makeExecutableSchema({ typeDefs, resolvers })
  const server = new ApolloServer({
    schema: applyMiddleware(schema, permissions),
    context: testContext(testToken), // not sure if this is the correct way. but we didn`t find another solution to add the token as request (see https://github.com/apollographql/apollo-server/issues/2277)
    dataSources: () => ({
      posts: new PostsDataSource(postData, userData)
    })
  })
  return createTestClient(server)
}

describe('Test apollo server queries', () => {
  it('get all posts returns 1 post', async () => {
    const postData = [
      { id: 'post1', title: 'Item 1', votes: 0, voters: [], author: {} }
    ]
    const userData = [
      { id: 'userid1', name: 'user1', email: 'user1@example.org', password: bcrypt.hashSync('user1password', 10), posts: [postData[0]] }
    ]
    postData[0].author = userData[0]

    const { query } = setupServer(postData, userData)
    const GET_POSTS = '{ posts { id votes }}'
    const res = await query({ query: GET_POSTS })
    expect(res.errors).toBeUndefined()
    expect(res.data.posts.length).toEqual(1)
    expect(res.data.posts[0].id).toEqual('post1')
    expect(res.data.posts[0].title).toBeUndefined()
  })

  it('queries are indefinitely nestable', async () => {
    const postData = [
      { id: 'post1', title: 'Item 1', votes: 0, voters: [], author: {} }
    ]
    const userData = [
      { id: 'userid1', name: 'user1', email: 'user1@example.org', password: bcrypt.hashSync('user1password', 10), posts: [postData[0]] }
    ]
    postData[0].author = userData[0]

    const { query } = setupServer(postData, userData)
    const GET_POSTS = '{ posts { title author { name posts { title author { name }}}}}'
    const res = await query({ query: GET_POSTS })
    expect(res.errors).toBeUndefined()
    expect(res.data.posts[0].author.posts[0].author.name).toEqual('user1')
  })

  it('get all user return 1 user', async () => {
    const postData = [
      { id: 'post1', title: 'Item 1', votes: 0, voters: [], author: {} }
    ]
    const userData = [
      { id: 'userid1', name: 'user1', email: 'user1@example.org', password: bcrypt.hashSync('user1password', 10), posts: [postData[0]] }
    ]
    postData[0].author = userData[0]

    const { query } = setupServer(postData, userData)
    const GET_USERS = '{ users { name }}'
    const res = await query({ query: GET_USERS })
    expect(res.errors).toBeUndefined()
    expect(res.data.users.length).toEqual(1)
    expect(res.data.users[0].name).toEqual('user1')
  })

  it('upvote a post with invalid token returns error', async () => {
    const postData = [
      { id: 'post1', title: 'Item 1', votes: 0, voters: [], author: {} }
    ]
    const userData = [
      { id: 'userid1', name: 'user1', email: 'user1@example.org', password: bcrypt.hashSync('user1password', 10), posts: [postData[0]] }
    ]
    postData[0].author = userData[0]

    const { mutate } = setupServer(postData, userData, 'invalidToken')
    const UPVOTE = 'mutation { upvote(id: "post1") { votes }}'
    const res = await mutate({ mutation: UPVOTE })
    expect(res.errors.length).toEqual(1)
    expect(res.errors[0].message).toEqual('Not Authorised!')
  })

  it('upvote a post with valid token increases count', async () => {
    const postData = [
      { id: 'post1', title: 'Item 1', votes: 0, voters: [], author: {} }
    ]
    const userData = [
      { id: 'userid1', name: 'user1', email: 'user1@example.org', password: bcrypt.hashSync('user1password', 10), posts: [postData[0]] }
    ]
    postData[0].author = userData[0]
    let server = setupServer(postData, userData, 'invalidToken')
    const LOGIN = 'mutation {  login (email: "user1@example.org", password: "user1password") }'
    const res = await server.mutate({ mutation: LOGIN })
    server = setupServer(postData, userData, res.data.login)
    const UPVOTE = 'mutation { upvote(id: "post1") { votes }}'
    const resUpvote = await server.mutate({ mutation: UPVOTE })
    expect(resUpvote.errors).toBeUndefined()
    expect(resUpvote.data.upvote.votes).toEqual(1)
  })

  it('upvote a post two times from the same user only upvotes the post once', async () => {
    const postData = [
      { id: 'post1', title: 'Item 1', votes: 0, voters: [], author: {} }
    ]
    const userData = [
      { id: 'userid1', name: 'user1', email: 'user1@example.org', password: bcrypt.hashSync('user1password', 10), posts: [postData[0]] }
    ]
    postData[0].author = userData[0]

    let server = setupServer(postData, userData)
    const LOGIN = 'mutation {  login (email: "user1@example.org", password: "user1password") }'
    const res = await server.mutate({ mutation: LOGIN })

    server = setupServer(postData, userData, res.data.login)
    const UPVOTE = 'mutation { upvote(id: "post1") { votes }}'
    const resFirstUpvote = await server.mutate({ mutation: UPVOTE })
    expect(resFirstUpvote.errors).toBeUndefined()
    expect(resFirstUpvote.data.upvote.votes).toEqual(1)
    const resSecondUpvote = await server.mutate({ mutation: UPVOTE })
    expect(resSecondUpvote.errors).toBeUndefined()
    expect(resSecondUpvote.data.upvote.votes).toEqual(1)
  })

  it('add a post with invalid token returns error', async () => {
    const postData = [
      { id: 'post1', title: 'Item 1', votes: 0, voters: [], author: {} }
    ]
    const userData = [
      { id: 'userid1', name: 'user1', email: 'user1@example.org', password: bcrypt.hashSync('user1password', 10), posts: [postData[0]] }
    ]
    postData[0].author = userData[0]

    const { mutate } = setupServer(postData, userData, 'invalidToken')
    const ADD_POST = 'mutation { write(post: { title: "TestTitle" }) { title author { name posts { title }}}}'
    const res = await mutate({ mutation: ADD_POST })
    expect(res.errors.length).toEqual(1)
    expect(res.errors[0].message).toEqual('Not Authorised!')
  })

  it('add a post from an existing user adds the post to the user', async () => {
    const postData = [
      { id: 'post1', title: 'Item 1', votes: 0, voters: [], author: {} }
    ]
    const userData = [
      { id: 'userid1', name: 'user1', email: 'user1@example.org', password: bcrypt.hashSync('user1password', 10), posts: [postData[0]] }
    ]
    postData[0].author = userData[0]

    let server = setupServer(postData, userData)
    const LOGIN = 'mutation {  login (email: "user1@example.org", password: "user1password") }'
    const res = await server.mutate({ mutation: LOGIN })

    server = setupServer(postData, userData, res.data.login)
    const ADD_POST = 'mutation { write(post: { title: "TestTitle" }) { title author { name posts { title }}}}'
    const resAdd = await server.mutate({ mutation: ADD_POST })
    expect(resAdd.errors).toBeUndefined()
    expect(resAdd.data.write.title).toEqual('TestTitle')
    expect(resAdd.data.write.author.name).toEqual('user1')
    expect(resAdd.data.write.author.posts.length).toEqual(2)
  })

  it('signup with password shorter than 8 characters return null', async () => {
    const { mutate } = setupServer([], [])
    const SIGNUP = 'mutation {  signup (name: "testuser", email: "testuser@example.org", password: "short") }'
    const res = await mutate({ mutation: SIGNUP })
    expect(res.errors).toBeUndefined()
    expect(res.data.signup).toBeNull()
  })

  it('signup with a valid password returns token', async () => {
    const { mutate } = setupServer([], [])
    const SIGNUP = 'mutation {  signup (name: "testuser", email: "testuser@example.org", password: "password") }'
    const res = await mutate({ mutation: SIGNUP })
    expect(res.errors).toBeUndefined()
    expect(res.data.signup).toEqual(expect.any(String))
  })

  it('trying to signup the same user twice returns null the second time', async () => {
    const { mutate } = setupServer([], [])
    const SIGNUP = 'mutation {  signup (name: "testuser", email: "testuser@example.org", password: "password") }'
    await mutate({ mutation: SIGNUP })
    const res = await mutate({ mutation: SIGNUP })
    expect(res.errors).toBeUndefined()
    expect(res.data.signup).toBeNull()
  })

  it('trying to login with invalid data returns null', async () => {
    const { mutate } = setupServer([], [])
    const SIGNUP = 'mutation {  signup (name: "testuser", email: "testuser@example.org", password: "password") }'
    await mutate({ mutation: SIGNUP })
    const LOGIN = 'mutation {  login (email: "testuser@example.org", password: "invalid") }'
    const res = await mutate({ mutation: LOGIN })
    expect(res.errors).toBeUndefined()
    expect(res.data.login).toBeNull()
  })

  it('trying to login with valid data returns token', async () => {
    const { mutate } = setupServer([], [])
    const SIGNUP = 'mutation {  signup (name: "testuser", email: "testuser@example.org", password: "password") }'
    await mutate({ mutation: SIGNUP })
    const LOGIN = 'mutation {  login (email: "testuser@example.org", password: "password") }'
    const res = await mutate({ mutation: LOGIN })
    expect(res.errors).toBeUndefined()
    expect(res.data.login).toEqual(expect.any(String))
  })
})
