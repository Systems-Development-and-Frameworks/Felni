import NewsList from './NewsList.vue'

export default {
  title: 'NewsList',
  component: NewsList
}

const Template = () => ({
  components: { NewsList },
  template: '<NewsList/>'
})

export const Default = Template.bind({})
