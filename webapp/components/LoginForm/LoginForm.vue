<template>
  <div class="justify-content-center">
    <form @submit.prevent="login">
      <div class="form-group">
        <label for="exampleInputEmail1">Email address</label>
        <input
          id="exampleInputEmail1"
          v-model="mail"
          type="email"
          placeholder="Enter your email here"
          class="form-control"
          aria-describedby="emailHelp"
        >
      </div>
      <div class="form-group">
        <label for="exampleInputPassword1">Password</label>
        <input
          id="exampleInputPassword1"
          v-model="password"
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
</template>

<script>
export default {
  name: 'LoginForm',
  data: () => {
    return {
      mail: '',
      password: ''
    }
  },
  methods: {
    login () {
      // this could be done with a plugin as suggested in the exercise
      // const LOGIN = 'mutation {  login (email: "' + mail + '", password: "' + password + '") }'
      // const res = await testClient.mutate({ mutation: LOGIN })
      // this.store.commit('auth/setToken', res.data.login)
    }
  }
}
</script>
