<template>
  <div class="input-group mb-3">
      <form @submit="additemandpreventdefault($event)">
        <input type="text" v-model="newsTitle" placeholder="add news title here" class="form-control">
        <div class="input-group-append">
            <button class="btn btn-outline-secondary" type="submit">Create</button>
        </div>
      </form>
  </div>
</template>

<script>
export default {
  name: 'NewsForm',
  data: () => {
    return {
      newsTitle: ''
    }
  },
  methods:{
    additemandpreventdefault: function (e) {
      this.$emit('additemandpreventdefaultevent', this.newsTitle)
      this.newsTitle = ''
      e.preventDefault();
    }
  }
};
</script>