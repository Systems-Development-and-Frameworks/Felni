<template>
  <div class="container">
    <div class="row justify-content-center">
      <div class="col text-center">
        <NewsList></NewsList>
      </div>
    </div>
  </div>
</template>

<script>
import NewsList from "./components/NewsList";

export default {
  name: "App",
  components: {
    NewsList,
  },
};
</script>
