import { DataSource } from 'apollo-datasource'
import { v4 as uuidv4 } from 'uuid'
import { sign } from 'jsonwebtoken'
import { JWTSECRET } from './importSecret'
import { hashSync, compareSync } from 'bcrypt'
import { AuthenticationError, UserInputError, ForbiddenError } from 'apollo-server'
import { Post } from './post'
import { User } from './user'

export class PostsDataSource extends DataSource {
  async getUsers (session) {
    const txc = session.beginTransaction()
    const result = await txc.run('MATCH (n:User) RETURN n.email')
    await txc.commit()
    return result
  }

  async getUserByEmail (session, email) {
    const txc = session.beginTransaction()
    const result = await txc.run('MATCH (n:User) WHERE n.email = $email RETURN n', {
      email: email
    })
    await txc.commit()
    return result
  }

  async getUserById (session, id) {
    const txc = session.beginTransaction()
    const result = await txc.run('MATCH (n:User) WHERE n.id = $id RETURN n', {
      id: id
    })
    await txc.commit()
    return result
  }

  async upvote (postId, userId, driver) {
    const session = driver.session()
    const txc = session.beginTransaction()

    let foundItems;
    await txc.run('MATCH (u:User)-[rel:VOTED]->(p:Post) WHERE p.id = $postId AND u.id = $userId RETURN p', {
      postId: postId,
      userId: userId
    }).then(result => {
      foundItems = result.records;
    })

    if (!foundItems.length) {
      let updatedItem;
      await txc.run('MATCH (p:Post) WHERE p.id = $postId SET p.votes = p.votes + 1 RETURN p', {
        postId: postId
      }).then(result => {
        updatedItem = result.records[0]._fields[0].properties
      })
  
      await txc.run('MATCH (p:Post), (u:User) WHERE p.id = $postId AND u.id = $userId CREATE (u)-[r:VOTED]->(p)', {
        postId: postId,
        userId: userId
      })

      await txc.commit();
      return updatedItem;
    } else {
      return foundItems[0]._fields[0].properties;
    }
  }

  async addPost (newPost, userId, driver) {
    const session = driver.session()
    let foundUserProperties
    await this.getUserById(session, userId).then(result => {
      if (result.records.length === 0) throw new UserInputError('No user found with this id')
      foundUserProperties = result.records[0]._fields[0].properties
    })
    if (foundUserProperties) {
      const item = new Post(uuidv4(), newPost.title)
      const txc = session.beginTransaction()
      let createResult
      await txc.run(' CREATE (n:Post { id: $postId, title: $postTitle, votes: 0 }) RETURN n', {
        postId: item.id,
        postTitle: item.title
      }).then(result => {
        createResult = result.records[0]._fields[0].properties
      })
      await txc.run('MATCH (p:Post), (u:User) WHERE p.id = $postId AND u.id = $userId CREATE (u)-[r:POSTED]->(p)', {
        postId: createResult.id,
        userId: userId

      })
      await txc.commit()
      return createResult.id
    }
    return null
  }

  async login (email, password, driver) {
    const session = driver.session()
    let foundUserProperties
    await this.getUserByEmail(session, email).then(result => {
      if (result.records.length === 0) throw new UserInputError('No user found with this email')
      foundUserProperties = result.records[0]._fields[0].properties
    })
    if (compareSync(password, foundUserProperties.password)) {
      return sign({ id: foundUserProperties.id }, JWTSECRET, { algorithm: 'HS256' })
    }
    throw new AuthenticationError('Wrong email/password combination')
  }

  async addUser (name, email, password, driver) {
    if (password.length < 8) {
      throw new UserInputError('Password must have at least 8 characters')
    }
    const session = driver.session()
    let existingEmails = []
    await this.getUsers(session).then(result => {
      existingEmails = result.records.map(record => record._fields[0])
    })
    if (existingEmails.includes(email)) {
      throw new ForbiddenError('Email already taken by another user')
    }
    const user = new User(uuidv4(), name, email, hashSync(password, 10))
    const txc = session.beginTransaction()
    await txc.run('CREATE (n:User { id:$userId, name: $userName, email: $userEmail, password: $userPassword })', {
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      userPassword: user.password

    })
    await txc.commit()
    return sign({ id: user.id }, JWTSECRET, { algorithm: 'HS256' })
  }
}
