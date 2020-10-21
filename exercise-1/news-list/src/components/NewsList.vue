<template>
    <div class="mt-4">
        <h1>News List</h1>
        <div v-for="item in items" :key="item.id">
        <NewsItem
            :item="item"
            v-on:addcounter="addcounter($event)"
            v-on:reducecounter="reducecounter($event)"
            v-on:removeitem="removeitem($event)"
        ></NewsItem>
        </div>
        <NewsForm v-on:additemandpreventdefaultevent="additem($event)"></NewsForm>
    </div>
</template>

<script>
import NewsItem from "./NewsItem";
import NewsForm from "./NewsForm";

var idCounter = 0;
function createListItemId() {
      idCounter = idCounter + 1;
      return idCounter;
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
        { id: createListItemId(), title: "Item 1", votes: 0 },
        { id: createListItemId(), title: "Item 2", votes: 0 },
      ]
    };
  },
  methods: {
    addcounter(id) {
      let item = this.items.find((item) => id == item.id);
      item.votes += 1;
      this.sortitems();
    },
    reducecounter(id) {
      let item = this.items.find((item) => id == item.id);
      item.votes -= 1;
      this.sortitems();
    },
    removeitem(id) {
      this.items = this.items.filter((item) => {
        return item.id !== id;
      });
    },
    sortitems() {
      this.items.sort((item1, item2) => {
        return item1.votes > item2.votes ? -1 : 1;
      });
    },
    additem(title) {
      this.items.push({'id': createListItemId(), 'title': title, 'votes': 0});
    },
  },
};
</script>