export class Post {
    id
    title
    votes
    voters
    author
    constructor (id, title, author?) {
      this.id = id
      this.title = title
      this.votes = 0
      this.voters = []
      this.author = author || {}
    }
}
