import { DataSource } from 'apollo-datasource'
import { v4 as uuidv4 } from 'uuid'
import { sign } from 'jsonwebtoken'
import { JWTSECRET } from './importSecret'
import { hashSync, compareSync } from 'bcrypt'
import { AuthenticationError, UserInputError, ForbiddenError } from 'apollo-server'
import { Post } from './post'
import { User } from './user'

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
    return !!this.users.find(user => user.id === id)
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
      const item = new Post(uuidv4(), newPost.title, foundUser)
      foundUser.posts.push(item)
      this.posts.push(item)
      return item
    }
    return null
  }

  login (email, password) {
    const foundUser = this.getUsers().find(user => user.email === email)

    if (foundUser) {
      if (compareSync(password, foundUser.password)) {
        return sign({ id: foundUser.id }, JWTSECRET, { algorithm: 'HS256' })
      }
      throw new AuthenticationError('Wrong email/password combination')
    }
  }

  addUser (name, email, password) {
    if (password.length < 8) {
      throw new UserInputError('Password must have at least 8 characters')
    }
    const foundUser = this.getUsers().find(user => user.email === email)
    if (foundUser) {
      throw new ForbiddenError('Email already taken by another user')
    }
    const user = new User(uuidv4(), name, email, hashSync(password, 10))
    this.users.push(user)
    return sign({ id: user.id }, JWTSECRET, { algorithm: 'HS256' })
  }
}
