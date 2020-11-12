import { PostsDataSource } from './postsDataSource.js'

// includes application-specific methods to be called by resolvers
export class PostsDB extends PostsDataSource {
  upvote (newsId, voter) {
    // TODO....
  }

  downvote (newsId, voter) {
    // TODO....
  }

  getUsers () {
    return [...new Set(this.items.map(item => item.author))]
  }

  getPosts () {
    return this.items
  }

  addPost (post) {
    this.add(post)
  }
}
