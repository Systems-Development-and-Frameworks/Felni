import { DataSource } from 'apollo-datasource'
import { v4 as uuidv4 } from 'uuid'
require('dotenv').config()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

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
    const foundUser = this.getUsers().find(user => user.id === voter.id)
    if (foundItem && foundUser) {
      if (!foundItem.voters.includes(foundUser.id)) {
        foundItem.votes += 1
        foundItem.voters.push(foundUser.id)
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

  async addUser (name, email, password) {
    if (password.length >= 8) {
      const foundUser = this.getUsers().find(user => user.email === email)
      if (foundUser) {
        return null
      } else {
        const user = { id: uuidv4(), name: name, email: email, password: await bcrypt.hash(password, 10), posts: [] }
        this.users.push(user)
        return jwt.sign({ id: user.id }, process.env.JWTSECRET, { algorithm: 'HS256' })
      }
    } else {
      return null
    }
  }
}
