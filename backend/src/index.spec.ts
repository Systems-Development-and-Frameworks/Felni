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
})
