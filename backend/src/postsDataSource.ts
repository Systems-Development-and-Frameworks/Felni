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

  existsUser (id) {
    if (this.users.find(user => user.id === id)) {
      console.log('true')
      return true
    } else {
      console.log('false')
      return false
    }
  }

  getPosts () {
    return this.posts
  }

  upvote (postId, userId) {
    const foundItem = this.getPosts().find(item => item.id === postId)
    const foundUser = this.getUsers().find(user => user.id === userId)
    if (foundItem && foundUser) {
      if (!foundItem.voters.includes(foundUser.id)) {
        foundItem.votes += 1
        foundItem.voters.push(foundUser.id)
      }
    }
    return foundItem
  }

  addPost (newPost, userId) {
    const foundUser = this.getUsers().find(user => user.id === userId)
    if (foundUser) {
      const item = { id: uuidv4(), title: newPost.title, votes: 0, voters: [], author: foundUser }
      foundUser.posts.push(item)
      this.posts.push(item)
      return item
    }
    return null
  }

  login (email, password) {
    const foundUser = this.getUsers().find(user => user.email === email)

    if (foundUser) {
      if (bcrypt.compareSync(password, foundUser.password)) {
        return jwt.sign({ id: foundUser.id }, process.env.JWTSECRET, { algorithm: 'HS256' })
      }
    }
  }

  addUser (name, email, password) {
    if (password.length >= 8) {
      const foundUser = this.getUsers().find(user => user.email === email)
      if (foundUser) {
        return null
      } else {
        const user = { id: uuidv4(), name: name, email: email, password: bcrypt.hashSync(password, 10), posts: [] }
        this.users.push(user)
        return jwt.sign({ id: user.id }, process.env.JWTSECRET, { algorithm: 'HS256' })
      }
    } else {
      return null
    }
  }
}
