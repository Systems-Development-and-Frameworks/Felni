<template>
  <div class="mb-4 mt-4">
    <h2>{{ item.title }} ({{ item.votes }})</h2>
    <button type="button" class="btn btn-primary mr-2" v-on:click="addcounter">
      Upvote
    </button>
    <button
      type="button"
      class="btn btn-primary mr-2"
      v-on:click="reducecounter"
    >
      Downvote
    </button>
    <button
      type="button"
      class="btn btn-primary mr-2"
      v-on:click="$emit('removeitem', item.id)"
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
