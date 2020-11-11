import { DataSource } from 'apollo-datasource'
import { InMemoryLRUCache } from 'apollo-server-caching'
const crypto = require("crypto");

// DataSource without DBClient and hard coded data
class NewsListDataSource extends DataSource {
  constructor() {
    super()

    this.items = [
        { id: crypto.randomBytes(16).toString("hex"), title: 'Item 1', votes: 0, author: {name: 1, posts: []} },
        { id: crypto.randomBytes(16).toString("hex"), title: 'Item 2', votes: 0, author: {name: 2, posts: []} }
    ]
  }

  // The initialize() method is called automatically by Apollo Server.
  initialize({ context, cache } = {}) {
    this.context = context
    this.cache = cache || new InMemoryLRUCache()
  }

  get(id) {
    const item = this.items.find(item => item.id === id)
    return item
  }

  update(id, newItem) {
    this.items = this.items.map((item) => id === item.id ? newItem : item)
  }

  remove(id) {
    this.items = this.items.filter((item) => {
        return item.id !== id
      })
  }

  add(newItem) {
    // How to deal with author ?
    this.items.push({id: crypto.randomBytes(16).toString("hex"), ...newItem})
  }

}