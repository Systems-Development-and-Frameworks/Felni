<template>
  <div>
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <NuxtLink class="navbar-brand" to="/">
        Felni Hacker News
      </NuxtLink>
      <button
        class="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon" />
      </button>

      <div id="navbarSupportedContent" class="collapse navbar-collapse">
        <ul class="navbar-nav mr-auto">
          <li class="nav-item active">
            <NuxtLink class="nav-link" to="/">
              News
            </NuxtLink>
          </li>
        </ul>
        <NavbarLoginButton />
      </div>
    </nav>
    <div class="container">
      <Nuxt />
    </div>
  </div>
</template>

<style src="bootstrap/dist/css/bootstrap.css">
</style>

<script>
import NavbarLoginButton from '../components/NavbarLoginButton/NavbarLoginButton'

export default {
  name: 'Login',
  components: {
    NavbarLoginButton
  }
}
</script>
