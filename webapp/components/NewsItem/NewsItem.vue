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
    <button
      v-if="!loggedOut && isDeleteAllowed"
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
  computed: {
    isDeleteAllowed () {
      let token = this.$apolloHelpers.getToken()
      if (!token) {
        return false
      }
      token = token.replace('Bearer ', '')
      const decoded = jwt_decode(token)
      return decoded.id === this.mutableItem.author.id
    }
  },
  methods: {
    addcounter () {
      this.$emit('updateitem', this.mutableItem)
    }
  }
}
</script>

<style scoped>
.btn {
  background-color: #007baa;
}
</style>
