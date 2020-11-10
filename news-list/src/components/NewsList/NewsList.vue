<template>
  <div class="container">
    <div class="row justify-content-center">
      <div class="col text-center">
        <div class="mt-4">
          <h1>News List</h1>
            <button type="button" class="btn btn-outline-secondary ml-2 reverse-order-button" @click="reverseordering()">Reverse order</button>
          <div v-for="item in sortItems" :key="item.id">
            <NewsItem
              :item="item"
              v-on:updateitem="updateitem($event)"
              v-on:removeitem="removeitem($event)"
            ></NewsItem>
          </div>
          <div v-if="!sortItems.length" class="mb-4 mt-4 empty-list">
            The list is empty &#128546;
          </div>
          <NewsForm
            v-on:additemandpreventdefaultevent="additem($event)"
          ></NewsForm>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import NewsItem from '../NewsItem/NewsItem'
import NewsForm from '../NewsForm/NewsForm'

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
      ],
      orderAscending: false
    }
  },
  computed: {
    sortItems: function () {
      if (this.orderAscending) {
        return [...this.items].sort((item1, item2) => item1.votes - item2.votes)
      } else {
        return [...this.items].sort((item1, item2) => item2.votes - item1.votes)
      }
    }
  },
  methods: {
    updateitem (eventitem) {
      this.items = this.items.map((item) => eventitem.id === item.id ? eventitem : item)
    },
    removeitem (id) {
      this.items = this.items.filter((item) => {
        return item.id !== id
      })
    },
    additem (title) {
      this.items.push({ id: createListItemId(), title: title, votes: 0 })
    },
    reverseordering () {
      this.orderAscending = !this.orderAscending
    }
  }
}
</script>
