<template>
  <div class="input-group mb-3 justify-content-center">
    <form @submit.prevent="$emit('additemandpreventdefaultevent', newsTitle)">
      <input
        v-model="newsTitle"
        type="text"
        placeholder="add news title here"
        class="form-control title-input"
        aria-label="Newstitleinput"
      >
      <div class="input-group-append justify-content-center mt-2">
        <button
          class="btn btn-primary create-item-button"
          type="submit"
          :disabled="newsTitle == ''"
        >
          Create
        </button>
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
  }
}
</script>
