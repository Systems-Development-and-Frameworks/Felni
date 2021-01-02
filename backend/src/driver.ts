import neo4j from 'neo4j-driver'
import { NEO4J_PASSWORD, NEO4J_URI, NEO4J_USER } from './importSecret'
import { hashSync } from 'bcrypt'
import { Post } from './post'
import { User } from './user'

export async function createDriverAndStuffDatabase (deleteDatabase: boolean) {
  const driver = neo4j.driver(
    NEO4J_URI,
    neo4j.auth.basic(NEO4J_USER, NEO4J_PASSWORD)
  )
  const session = driver.session()
  const txc = session.beginTransaction()
  // Wipe existing database
  if (deleteDatabase) await txc.run('MATCH (n) DETACH DELETE n')
  // Stuff database with initial data
  let existingPosts = 0
  await txc.run('MATCH (n:Post) RETURN n').then(result => {
    existingPosts = result.records.length
  })
  if (existingPosts === 0) {
    // Initial data in case database is empty
    const post1 = new Post('post1id', 'item1')
    const user1 = new User('user1id', 'user1', 'user1@example.org', hashSync('user1password', 10))
    const posts = [post1]
    const users = [user1]
    for (let i = 0; i < posts.length; i++) {
      await txc.run(' CREATE (n:Post { id: $postId, title: $postTitle, votes: 0 })', {
        postId: posts[i].id,
        postTitle: posts[i].title
      })
      await txc.run('CREATE (n:User { id:$userId, name: $userName, email: $userEmail, password: $userPassword })', {
        userId: users[i].id,
        userName: users[i].name,
        userEmail: users[i].email,
        userPassword: users[i].password

      })

      await txc.run('MATCH (p:Post), (u:User) WHERE p.id = $postId AND u.id = $userId CREATE (u)-[r:POSTED]->(p)', {
        postId: posts[i].id,
        userId: users[i].id

      })
    }
  }
  await txc.commit()
  return driver
}
