<template>
  <div class="row justify-content-center">
    <div class="col text-center">
      <div class="mt-4">
        <h1>News List</h1>
        <button
          type="button"
          class="btn btn-outline-secondary ml-2 reverse-order-button"
          @click="reverseordering()"
        >
          Reverse order
        </button>
        <div v-for="item in sortItems" :key="item.id">
          <NewsItem
            :logged-out="loggedOut"
            :item="item"
            @updateitem="updateitem($event)"
            @removeitem="removeitem($event)"
          />
        </div>
        <div v-if="!sortItems.length" class="mb-4 mt-4 empty-list">
          The list is empty &#128546;
        </div>
        <NewsForm
          v-show="!loggedOut"
          @additemandpreventdefaultevent="additem($event)"
        />
      </div>
    </div>
  </div>
</template>

<script>
import gql from 'graphql-tag'
import NewsItem from '../NewsItem/NewsItem'
import NewsForm from '../NewsForm/NewsForm'

export default {
  name: 'NewsList',
  components: {
    NewsItem,
    NewsForm
  },
  props: {
    loggedOut: {
      type: Boolean
    }
  },
  apollo: {
    posts: {
      query: gql`
           query posts {
             posts {
              id
              title
              votes
              author {
                id
              }
             }
           }
         `,
      result ({ data }) {
        this.items = data.posts
      }
    }
  },
  data: () => {
    return {
      items: [],
      orderAscending: false
    }
  },
  computed: {
    sortItems () {
      if (this.orderAscending) {
        return [...this.items].sort((item1, item2) => item1.votes - item2.votes)
      } else {
        return [...this.items].sort((item1, item2) => item2.votes - item1.votes)
      }
    }
  },
  methods: {
    async updateitem (eventitem) {
      const upvotePost = gql`
        mutation upvotePost($id: ID!) {
          upvote(id: $id ) {
            id
            title
            votes
            author {
              id
            }
          }
        }
      `
      try {
        await this.$apollo
          .mutate({
            mutation: upvotePost,
            variables: {
              id: eventitem.id
            },
            context: {
              headers: {
                Authorization: 'Bearer ' + this.$store.state.auth.token
              }
            }
          })
          .then(({ data }) => {
            const index = this.items.findIndex(item => item.id === eventitem.id)
            this.items[index] = data.upvote
            this.items = [...this.items]
          })
      } catch (e) {
        alert(e)
      }
      // this.items = this.items.map(item => eventitem.id === item.id ? eventitem : item)
    },
    async removeitem (id) {
      const deletePost = gql`
        mutation deletePost($id: ID!) {
          delete(id: $id ) {
            id
          }
        }
      `
      try {
        await this.$apollo
          .mutate({
            mutation: deletePost,
            variables: {
              id
            },
            context: {
              headers: {
                Authorization: 'Bearer ' + this.$store.state.auth.token
              }
            }
          })
        const index = this.items.findIndex(item => item.id === id)
        this.items.splice(index, 1)
        this.items = [...this.items]
      } catch (e) {
        alert(e)
      }
    },
    async additem (title) {
      // mutation for add post
      const addPost = gql`
        mutation addPost($title: String!) {
          write(post: { title: $title }) {
            id
            title
            votes
            author {
              id
            }
          }
        }
      `
      try {
        await this.$apollo
          .mutate({
            mutation: addPost,
            variables: {
              title
            },
            context: {
              headers: {
                Authorization: 'Bearer ' + this.$store.state.auth.token
              }
            }
          })
          .then(({ data }) => {
            this.items.push(data.write)
          })
      } catch (e) {
        alert(e)
      }
    },
    reverseordering () {
      this.orderAscending = !this.orderAscending
    }
  }
}
</script>
