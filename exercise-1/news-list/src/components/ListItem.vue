<template>
  <div>
    <h2>{{ item.title }} ({{ item.votes }})</h2>
    <button v-on:click="$emit('addcounter', item.id)">Upvote</button>
    <button v-on:click="$emit('reducecounter', item.id)">Downvote</button>
    <button v-on:click="$emit('removeitem', item.id)">Remove</button>
  </div>
</template>

<script>
export default {
  props: ['item'],
  name: 'ListItem'
};
</script>

