export const state = () => ({
  token: ''
})

export const mutations = {
  setToken (state, token) {
    state.token = token
  }
}
