import { resolvers } from './resolvers'
import { typeDefs } from './typeDefs'
import { PostsDataSource } from './postsDataSource'
import { ApolloServer } from 'apollo-server'
import { createTestClient } from 'apollo-server-testing'

describe('Test apollo server queries', () => {
  it('get all posts returns 1 post', async () => {
    const postData = [
      { id: 'post1', title: 'Item 1', votes: 0, voters: [], author: {} }
    ]
    const userData = [
      { name: 'user1', posts: [postData[0]] }
    ]
    postData[0].author = userData[0]

    const server = new ApolloServer({
      typeDefs,
      resolvers,
      dataSources: () => ({
        posts: new PostsDataSource(postData, userData)
      })
    })
    const GET_POSTS = '{ posts { id votes }}'
    const { query } = createTestClient(server)
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
      { name: 'user1', posts: [postData[0]] }
    ]
    postData[0].author = userData[0]

    const server = new ApolloServer({
      typeDefs,
      resolvers,
      dataSources: () => ({
        posts: new PostsDataSource(postData, userData)
      })
    })
    const GET_POSTS = '{ posts { title author { name posts { title author { name }}}}}'
    const { query } = createTestClient(server)
    const res = await query({ query: GET_POSTS })
    expect(res.errors).toBeUndefined()
    expect(res.data.posts[0].author.posts[0].author.name).toEqual('user1')
  })

  it('get all user return 1 user', async () => {
    const postData = [
      { id: 'post1', title: 'Item 1', votes: 0, voters: [], author: {} }
    ]
    const userData = [
      { name: 'user1', posts: [postData[0]] }
    ]
    postData[0].author = userData[0]

    const server = new ApolloServer({
      typeDefs,
      resolvers,
      dataSources: () => ({
        posts: new PostsDataSource(postData, userData)
      })
    })
    const GET_USERS = '{ users { name }}'
    const { query } = createTestClient(server)
    const res = await query({ query: GET_USERS })
    expect(res.errors).toBeUndefined()
    expect(res.data.users.length).toEqual(1)
    expect(res.data.users[0].name).toEqual('user1')
  })

  it('upvote a post two times from the same user only upvotes the post once', async () => {
    const postData = [
      { id: 'post1', title: 'Item 1', votes: 0, voters: [], author: {} }
    ]
    const userData = [
      { name: 'user1', posts: [postData[0]] }
    ]
    postData[0].author = userData[0]

    const server = new ApolloServer({
      typeDefs,
      resolvers,
      dataSources: () => ({
        posts: new PostsDataSource(postData, userData)
      })
    })

    const UPVOTE = 'mutation { upvote(id: "post1", voter: {name: "user1" }) { votes }}'
    const { mutate } = createTestClient(server)
    const resFirstUpvote = await mutate({ mutation: UPVOTE })
    expect(resFirstUpvote.errors).toBeUndefined()
    expect(resFirstUpvote.data.upvote.votes).toEqual(1)
    const resSecondUpvote = await mutate({ mutation: UPVOTE })
    expect(resSecondUpvote.errors).toBeUndefined()
    expect(resSecondUpvote.data.upvote.votes).toEqual(1)
  })

  it('add a post from an existing user adds the post to the user', async () => {
    const postData = [
      { id: 'post1', title: 'Item 1', votes: 0, voters: [], author: {} }
    ]
    const userData = [
      { name: 'user1', posts: [postData[0]] }
    ]
    postData[0].author = userData[0]

    const server = new ApolloServer({
      typeDefs,
      resolvers,
      dataSources: () => ({
        posts: new PostsDataSource(postData, userData)
      })
    })
    const ADD_POST = 'mutation { write(post: { title: "TestTitle", author: { name: "user1" }}) { title author { name posts { title }}}}'
    const { mutate } = createTestClient(server)
    const res = await mutate({ mutation: ADD_POST })
    expect(res.errors).toBeUndefined()
    expect(res.data.write.title).toEqual('TestTitle')
    expect(res.data.write.author.name).toEqual('user1')
    expect(res.data.write.author.posts.length).toEqual(2)
  })

  it('add a post from a new user adds a new user', async () => {
    const postData = [
      { id: 'post1', title: 'Item 1', votes: 0, voters: [], author: {} }
    ]
    const userData = [
      { name: 'user1', posts: [postData[0]] }
    ]
    postData[0].author = userData[0]

    const server = new ApolloServer({
      typeDefs,
      resolvers,
      dataSources: () => ({
        posts: new PostsDataSource(postData, userData)
      })
    })
    const ADD_POST = 'mutation { write(post: { title: "TestTitle", author: { name: "user2" }}) { title author { name posts { title }}}}'
    const { mutate } = createTestClient(server)
    const resMutation = await mutate({ mutation: ADD_POST })
    expect(resMutation.errors).toBeUndefined()
    expect(resMutation.data.write.title).toEqual('TestTitle')
    expect(resMutation.data.write.author.name).toEqual('user2')
    expect(resMutation.data.write.author.posts.length).toEqual(1)

    const GET_USERS = '{ users { name }}'
    const { query } = createTestClient(server)
    const resQuery = await query({ query: GET_USERS })
    expect(resQuery.errors).toBeUndefined()
    expect(resQuery.data.users.length).toEqual(2)
  })
})
