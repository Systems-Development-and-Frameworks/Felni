<template>
  <div class="mb-4 mt-4">
    <h2>
      <span class="news-title">{{ item.title }}</span>&nbsp;<span class="news-votes">({{ item.votes }})</span>
    </h2>
    <button
      type="button"
      class="btn btn-primary mr-2 upvote-button"
      @click="addcounter"
    >
      Upvote
    </button>
    <button
      type="button"
      class="btn btn-primary mr-2 downvote-button"
      @click="reducecounter"
    >
      Downvote
    </button>
    <button
      type="button"
      class="btn btn-primary mr-2 remove-button"
      @click="$emit('removeitem', item.id)"
    >
      Remove
    </button>
  </div>
</template>

<script>
export default {
  name: 'NewsItem',
  props: {
    item: { type: Object, required: true }
  },
  data () {
    return {
      mutableItem: this.item
    }
  },
  methods: {
    addcounter () {
      this.mutableItem.votes += 1
      this.$emit('updateitem', this.mutableItem)
    },
    reducecounter () {
      this.mutableItem.votes -= 1
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
