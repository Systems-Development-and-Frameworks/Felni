<template>
  <div class="input-group mb-3">
      <form>
        <input type="text" class="form-control">
        <div class="input-group-append">
            <!-- Prevent the default behaviour of a <form> html element which would execute a HTTP request on submit. -->
            <!-- NewsList hat die Methode additem(title) die aufgerufen werden muss.-->
            <button class="btn btn-outline-secondary" type="submit">Create</button>
        </div>
      </form>
  </div>
</template>

<script>
export default {
  name: 'NewsForm'
};
</script>