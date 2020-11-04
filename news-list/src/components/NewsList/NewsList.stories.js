import NewsList from './NewsList.vue'

export default {
  title: 'NewsList',
  component: NewsList
}

const Template = (args, { argTypes }) => ({
  components: { NewsList },
  template: '<NewsList/>'
})

export const Default = Template.bind({})
