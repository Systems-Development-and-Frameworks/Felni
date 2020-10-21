<template>
  <div class="input-group mb-3 justify-content-center">
      <form @submit="additemandpreventdefault($event)">
        <input type="text" v-model="newsTitle" placeholder="add news title here" class="form-control">
        <div class="input-group-append justify-content-center mt-2">
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