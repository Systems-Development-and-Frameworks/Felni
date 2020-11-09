<template>
  <div class="mb-4 mt-4">
    <h2><span class="news-title">{{ item.title }}</span>&nbsp;<span class="news-votes">({{ item.votes }})</span></h2>
    <button type="button" class="btn btn-primary mr-2 upvote-button" v-on:click="addcounter">
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
  props: ['item'],
  name: 'NewsItem',
  methods: {
    addcounter () {
      this.item.votes += 1
      this.$emit('updateitem', this.item)
    },
    reducecounter () {
      this.item.votes -= 1
      this.$emit('updateitem', this.item)
    }
  }
}
</script>

<style scoped>
.btn {
  background-color: #007BAA;
}
</style>
