import { DataSource } from 'apollo-datasource'
import { v4 as uuidv4 } from 'uuid'

export class PostsDataSource extends DataSource {
  posts
  users
  constructor (posts, users) {
    super()

    this.posts = posts
    this.users = users
  }

  getUsers () {
    return this.users
  }

  getPosts () {
    return this.posts
  }

  upvote (postId, voter) {
    const foundItem = this.getPosts().find(item => item.id === postId)
    const foundUser = this.getUsers().find(user => user.name === voter.name)
    if (foundItem && foundUser) {
      if (!foundItem.voters.includes(foundUser.name)) {
        foundItem.votes += 1
        foundItem.voters.push(foundUser.name)
      }
    }
    return foundItem
  }

  addPost (newPost) {
    const foundUser = this.getUsers().find(user => user.name === newPost.author.name)
    if (foundUser) {
      const item = { id: uuidv4(), title: newPost.title, votes: 0, voters: [], author: foundUser }
      foundUser.posts.push(item)
      this.posts.push(item)
      return item
    } else {
      const item = { id: uuidv4(), title: newPost.title, votes: 0, voters: [], author: {} }
      const user = { name: newPost.author.name, posts: [item] }
      item.author = user
      this.users.push(user)
      this.posts.push(item)
      return item
    }
  }
}
