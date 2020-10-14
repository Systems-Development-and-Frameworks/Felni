<template>
  <div>
    <h1>News List</h1>
    <div v-for="item in items" :key="item.id">
      <ListItem
        :item="item"
        v-on:addcounter="addcounter($event)"
        v-on:reducecounter="reducecounter($event)"
        v-on:removeitem="removeitem($event)"
      ></ListItem>
    </div>
  </div>
</template>

<script>
import ListItem from "./components/ListItem";
export default {
  components: {
    ListItem,
  },
  data: () => {
    return {
      items: [
        { id: 0, title: "Item 1", votes: 0 },
        { id: 1, title: "Item 2", votes: 0 },
      ],
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
  },
};
</script>

<style>
</style>
