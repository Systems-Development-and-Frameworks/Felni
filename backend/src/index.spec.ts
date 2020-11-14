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
    const GET_POSTS = '{ posts { id votes } }'
    const { query } = createTestClient(server)
    const res = await query({ query: GET_POSTS })
    expect(res.data.posts.length).toEqual(1)
    expect(res.data.posts[0].id).toEqual('post1')
    expect(res.data.posts[0].title).toBeUndefined()
  })

  it('get all user return 1 user', async () => {
    const postData = [
      { id: 'post1', title: 'Item 1', votes: 0, voters: [], author: {} }
    ]
    const userData = [
      { name: 'user1', posts: [postData[0]], }
    ]
    postData[0].author = userData[0]

    const server = new ApolloServer({
      typeDefs,
      resolvers,
      dataSources: () => ({
        posts: new PostsDataSource(postData, userData)
      })
    })
    const GET_USERS = '{ users { name } }'
    const { query } = createTestClient(server)
    const res = await query({ query: GET_USERS })
    expect(res.data.users.length).toEqual(1)
    expect(res.data.users[0].name).toEqual('user1')
  })

  it('upvote a post two times', async () => {
    const postData = [
      { id: 'post1', title: 'Item 1', votes: 0, voters: [], author: {} }
    ]
    const userData = [
      { name: 'user1', posts: [postData[0]] },
      { name: 'user2', posts: [], }
    ]
    postData[0].author = userData[0]

    const server = new ApolloServer({
      typeDefs,
      resolvers,
      dataSources: () => ({
        posts: new PostsDataSource(postData, userData)
      })
    })
    //const UPVOTE = 'mutation ($id: ID!, $voter: UserInput!) { upvote(id: $id, voter: $voter) { votes}}'
    //const mutationVariables = {$id: "post1", $voter: {name: "user2"}}
    const UPVOTE = 'mutation { upvote(id: "post1", voter: {name: "user2"}) { votes}}'
    const { mutate  } = createTestClient(server)
    const res = await mutate ({ mutation: UPVOTE/*, variables: mutationVariables */})
    expect(res.data.upvote.votes).toEqual(1)
    const newRes = await mutate ({ mutation: UPVOTE/*, variables: mutationVariables */})
    expect(newRes.data.upvote.votes).toEqual(1)
  })

  it('add a post', async () => {
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
    //const ADD_POST = 'mutation ($post: Post!) { write(post: $post) { title author { name } }}'
    //const mutationVariables = {title: "TestTitle", author: {name: "user2"}}
    const ADD_POST = 'mutation { write(post: {title: "TestTitle", author: {name: "user2"}}) { title author { name }}}'
    const { mutate  } = createTestClient(server)
    const res = await mutate ({ mutation: ADD_POST/*, variables: mutationVariables */})
    expect(res.data.write.title).toEqual("TestTitle")
    expect(res.data.write.author.name).toEqual("user2")
  })
})
