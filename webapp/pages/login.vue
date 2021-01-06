<template>
  <div>
    <h1>Login</h1>
    <LoginForm />
  </div>
</template>

<script>
import LoginForm from '../components/LoginForm/LoginForm'
export default {
  components: {
    LoginForm
  },
  layout: 'login'
}
</script>
