import NewsForm from './NewsForm.vue'

export default {
  title: 'NewsForm',
  component: NewsForm
}

export const Story = () => ({
  components: { NewsForm },
  template: '<NewsForm/>'
})
