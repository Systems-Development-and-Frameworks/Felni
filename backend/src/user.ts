export class User {
    id
    name
    email
    password
    posts
    constructor (id, name, email, password) {
      this.id = id
      this.name = name
      this.email = email
      this.password = password
      this.posts = []
    }
}
