<template>
  <div class="mb-4 mt-4">
    <h2>{{ item.title }} ({{ item.votes }})</h2>
    <button type="button" class="btn btn-primary mr-2" v-on:click="$emit('addcounter', item.id)">Upvote</button>
    <button type="button" class="btn btn-primary mr-2" v-on:click="$emit('reducecounter', item.id)">Downvote</button>
    <button type="button" class="btn btn-primary mr-2" v-on:click="$emit('removeitem', item.id)">Remove</button>
  </div>
</template>

<script>
export default {
  props: ['item'],
  name: 'NewsItem'
};
</script>

