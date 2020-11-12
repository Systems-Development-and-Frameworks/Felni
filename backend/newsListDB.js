import NewsListDataSource from './newsListDataSource'

// includes application-specific methods to be called by resolvers
export default class NewsListDB extends NewsListDataSource {
  upvote (newsId, voter) {
    // TODO....
  }

  downvote (newsId, voter) {
    // TODO....
  }

  getUser (userId) {
    // TODO....
    if (userId) {
      this.get(userId)
    } else {
      return [...new Set(this.items.map(item => item.author))]
    }
  }

  getNews (newsId) {
    // TODO....
    if (newsId) {
      // TODO...
    } else {
      return this.items
    }
  }

  addNews (post) {
    // TODO....
    this.add(post)
  }
}
