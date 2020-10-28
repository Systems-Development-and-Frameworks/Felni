<template>
  <div class="mt-4">
    <h1>News List</h1>
    <div v-for="item in sortItems" :key="item.id">
      <NewsItem
        :item="item"
        v-on:updateitem="updateitem($event)"
        v-on:removeitem="removeitem($event)"
      ></NewsItem>
    </div>
    <NewsForm v-on:additemandpreventdefaultevent="additem($event)"></NewsForm>
  </div>
</template>

<script>
import NewsItem from './NewsItem'
import NewsForm from './NewsForm'

var idCounter = 0
function createListItemId () {
  idCounter = idCounter + 1
  return idCounter
}

export default {
  name: 'NewsList',
  components: {
    NewsItem,
    NewsForm
  },
  data: () => {
    return {
      items: [
        { id: createListItemId(), title: 'Item 1', votes: 0 },
        { id: createListItemId(), title: 'Item 2', votes: 0 }
      ]
    }
  },
  computed: {
    sortItems: function () {
      return [...this.items].sort((item1, item2) => {
        return item1.votes > item2.votes ? -1 : 1
      })
    }
  },
  methods: {
    updateitem (eventitem) {
      const item = this.items.find((item) => eventitem.id === item.id)
      item.votes = eventitem.votes
    },
    removeitem (id) {
      this.items = this.items.filter((item) => {
        return item.id !== id
      })
    },
    additem (title) {
      this.items.push({ id: createListItemId(), title: title, votes: 0 })
    }
  }
}
</script>
