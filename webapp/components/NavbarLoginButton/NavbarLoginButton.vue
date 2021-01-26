<template>
  <NuxtLink
    v-if="loggedOut"
    class="btn btn-outline-success"
    role="button"
    to="/login"
  >
    Login
  </NuxtLink>
  <button v-else class="btn btn-outline-danger" @click="logout">
    Logout
  </button>
</template>

<script>
export default {
  name: 'NavbarLoginButton',
  props: {
    loggedOut: {
      type: Boolean
    }
  },
  methods: {
    logout () {
      this.$apolloHelpers.onLogout()
      this.$emit('updateloggedoutstate')
    }
  }
}
</script>
