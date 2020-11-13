import crypto from 'crypto'
import pkg from 'apollo-datasource'
const { DataSource } = pkg

export class PostsDataSource extends DataSource {
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
      const item = { id: crypto.randomBytes(16).toString('hex'), title: newPost.title, votes: 0, voters: [], author: foundUser }
      foundUser.posts.push(item)
      this.posts.push(item)
      return item
    } else {
      const item = { id: crypto.randomBytes(16).toString('hex'), title: newPost.title, votes: 0, voters: [], author: {} }
      const user = { name: newPost.author.name, posts: [item] }
      item.author = user
      this.users.push(user)
      this.posts.push(item)
      return item
    }
  }
}
