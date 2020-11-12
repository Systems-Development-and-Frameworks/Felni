import crypto from 'crypto'
import pkg from 'apollo-datasource'
const { DataSource } = pkg

export class PostsDataSource extends DataSource {
  constructor (items) {
    super()

    this.items = items
  }

  getUsers () {
    return [...new Set(this.items.map(item => item.author))]
  }

  getPosts () {
    return this.items
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
