import NewsList from './NewsList.vue'

export default {
  title: 'NewsList',
  component: NewsList
}

export const Story = () => ({
  components: { NewsList },
  template: '<NewsList/>'
})
