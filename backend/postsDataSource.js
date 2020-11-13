import crypto from 'crypto'
import pkg from 'apollo-datasource'
const { DataSource } = pkg

export class PostsDataSource extends DataSource {
  constructor (items, users) {
    super()

    this.items = items
    this.users = users
  }

  getUsers () {
    return this.users
  }

  getPosts () {
    return this.items
  }

  upvote (postId, voter) {
    const foundItem = this.getPosts().find(item => item.id === postId)
    const foundUser = this.getUsers().find(user => user.name === voter.name)
    if (foundItem && foundUser) {
      foundItem.votes += 1
    }
    return foundItem
  }

  addPost (newItem) {
    const foundUser = this.getUsers().find(user => user.name === newItem.author.name)
    if (foundUser) {
      const item = { id: crypto.randomBytes(16).toString('hex'), title: newItem.title, votes: 0, author: foundUser }
      foundUser.posts.push(item)
      this.items.push(item)
      return item
    } else {
      const item = { id: crypto.randomBytes(16).toString('hex'), title: newItem.title, votes: 0, author: {} }
      const user = { name: newItem.author.name, posts: [item] }
      item.author = user
      this.users.push(user)
      this.items.push(item)
      return item
    }
  }
}
