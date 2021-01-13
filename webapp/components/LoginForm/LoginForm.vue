<template>
  <div class="justify-content-center">
    <div class="row">
      <div class="col-6">
        <h1>Login</h1>
        <form @submit.prevent="login">
          <div class="form-group">
            <label for="loginInputMail">Email address</label>
            <input
              id="loginInputMail"
              v-model="loginMail"
              type="email"
              placeholder="Enter your email here"
              class="form-control"
              aria-describedby="emailHelp"
            >
          </div>
          <div class="form-group">
            <label for="loginInputPassword">Password</label>
            <input
              id="loginInputPassword"
              v-model="loginPassword"
              placeholder="Enter your password here"
              type="password"
              class="form-control"
            >
          </div>
          <button type="submit" class="btn btn-primary">
            Submit
          </button>
        </form>
      </div>
      <div class="col-6">
        <h1>Signup</h1>
        <form @submit.prevent="signup">
          <div class="form-group">
            <label for="signupInputName">Name</label>
            <input
              id="signupInputName"
              v-model="signupName"
              placeholder="Enter your email here"
              class="form-control"
              aria-describedby="emailHelp"
            >
          </div>
          <div class="form-group">
            <label for="signupInputMail">Email address</label>
            <input
              id="signupInputMail"
              v-model="signupMail"
              type="email"
              placeholder="Enter your email here"
              class="form-control"
              aria-describedby="emailHelp"
            >
          </div>
          <div class="form-group">
            <label for="signupInputPassword">Password</label>
            <input
              id="signupInputPassword"
              v-model="signupPassword"
              placeholder="Enter your password here"
              type="password"
              class="form-control"
            >
          </div>
          <button type="submit" class="btn btn-primary">
            Submit
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import gql from 'graphql-tag'
export default {
  name: 'LoginForm',
  data: () => {
    return {
      loginMail: '',
      loginPassword: '',
      signupName: '',
      signupMail: '',
      signupPassword: ''
    }
  },
  methods: {
    async login () {
      const login = gql`
        mutation login($email: String!, $password: String!) {
          login(email: $email, password: $password)
        }
      `
      try {
        await this.$apollo
          .mutate({
            mutation: login,
            variables: {
              email: this.loginMail,
              password: this.loginPassword
            }
          })
          .then(async ({ data }) => {
            this.$store.commit('auth/setToken', data.login)
            await this.$apolloHelpers.onLogin(data.login)
            this.$router.push({
              path: '/'
            })
          })
      } catch (e) {
        alert(e)
      }
    },
    async signup () {
      const signup = gql`
        mutation signup($name: String!, $email: String!, $password: String!) {
          signup(name: $name, email: $email, password: $password)
        }
      `
      try {
        await this.$apollo
          .mutate({
            mutation: signup,
            variables: {
              name: this.signupName,
              email: this.signupMail,
              password: this.signupPassword
            }
          })
          .then(async ({ data }) => {
            this.$store.commit('auth/setToken', data.signup)
            await this.$apolloHelpers.onLogin(data.signup)
            this.$router.push({
              path: '/'
            })
          })
      } catch (e) {
        alert(e)
      }
    }
  }
}
</script>
