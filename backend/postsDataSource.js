import InMemoryLRUCache from 'apollo-server-caching'
import crypto from 'crypto'
import pkg from 'apollo-datasource'
const { DataSource } = pkg

// DataSource without DBClient and hard coded data
// eslint-disable-next-line no-unused-vars
export class PostsDataSource extends DataSource {
  constructor () {
    super()

    this.items = [
      { id: crypto.randomBytes(16).toString('hex'), title: 'Item 1', votes: 0, author: { name: crypto.randomBytes(16).toString('hex'), posts: [] } },
      { id: crypto.randomBytes(16).toString('hex'), title: 'Item 2', votes: 0, author: { name: crypto.randomBytes(16).toString('hex'), posts: [] } }
    ]
    this.items[0].author.posts.push(this.items[0])
    this.items[1].author.posts.push(this.items[1])
  }

  // The initialize() method is called automatically by Apollo Server.
  initialize ({ context, cache } = {}) {
    this.context = context
    this.cache = cache || new InMemoryLRUCache()
  }

  get (id) {
    const item = this.items.find(item => item.id === id)
    return item
  }

  update (id, newItem) {
    this.items = this.items.map((item) => id === item.id ? newItem : item)
  }

  remove (id) {
    this.items = this.items.filter((item) => {
      return item.id !== id
    })
  }

  add (newItem) {
    // How to deal with author ?
    this.items.push({ id: crypto.randomBytes(16).toString('hex'), ...newItem })
  }
}
