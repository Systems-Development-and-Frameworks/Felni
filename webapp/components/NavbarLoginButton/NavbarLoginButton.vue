<template>
  <NuxtLink v-if="loggedOut" class="btn btn-outline-success" role="button" to="/login">
    Login
  </NuxtLink>
  <button v-else class="btn btn-outline-danger" @click="logout">
    Logout
  </button>
</template>

<script>
export default {
  name: 'NavbarLoginButton',
  computed: {
    loggedOut () {
      return this.$apolloHelpers.getToken() === undefined
    }
  },
  methods: {
    logout () {
      this.$apolloHelpers.onLogout()
      location.reload()
    }
  }
}
</script>
