<template>
  <div class="mb-4 mt-4">
    <h2>
      <span class="news-title">{{ item.title }}</span>&nbsp;<span class="news-votes">({{ item.votes }})</span>
    </h2>
    <button
      v-show="!loggedOut"
      type="button"
      class="btn btn-primary mr-2 upvote-button"
      @click="addcounter"
    >
      Upvote
    </button>
    <!-- <button
      v-show="!loggedOut"
      type="button"
      class="btn btn-primary mr-2 downvote-button"
      @click="reducecounter"
    >
      Downvote
    </button> -->
    <button
      v-show="!loggedOut && isDeleteAllowed()"
      type="button"
      class="btn btn-primary mr-2 remove-button"
      @click="$emit('removeitem', item.id)"
    >
      Remove
    </button>
  </div>
</template>

<script>
// eslint-disable-next-line camelcase
import jwt_decode from 'jwt-decode'

export default {
  name: 'NewsItem',
  props: {
    item: { type: Object, required: true },
    loggedOut: {
      type: Boolean
    }
  },
  data () {
    return {
      mutableItem: this.item
    }
  },
  methods: {
    addcounter () {
      // this.mutableItem.votes += 1
      this.$emit('updateitem', this.mutableItem)
    },
    async isDeleteAllowed () {
      let token = await this.$apolloHelpers.getToken()
      if (!token) {
        return false
      }
      console.log(token)
      token = token.replace('Bearer ', '')
      const decoded = jwt_decode(token)
      return decoded.id === this.mutableItem.author.id
    }
    // reducecounter () {
    //   this.mutableItem.votes -= 1
    //   this.$emit('updateitem', this.mutableItem)
    // }
  }
}
</script>

<style scoped>
.btn {
  background-color: #007baa;
}
</style>
