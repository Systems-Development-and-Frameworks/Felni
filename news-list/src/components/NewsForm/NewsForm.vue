<template>
  <div class="input-group mb-3 justify-content-center">
    <form @submit="additemandpreventdefault($event)">
      <input
        type="text"
        v-model="newsTitle"
        placeholder="add news title here"
        class="form-control title-input"
        aria-label="Newstitleinput"
      />
      <div class="input-group-append justify-content-center mt-2">
        <button
          class="btn btn-primary create-item-button"
          type="submit"
          :disabled="newsTitle == ''"
        >
          Create
        </button>
        <button type="button" class="btn btn-outline-secondary ml-2 reverse-order-button" @click="$emit('reverseordering')">Reverse order</button>
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
  methods: {
    additemandpreventdefault: function (e) {
      this.$emit('additemandpreventdefaultevent', this.newsTitle)
      this.newsTitle = ''
      e.preventDefault() // Prevents the default behaviour of a <form> html element which would execute a HTTP request on submit.
    }
  }
}
</script>
