import NewsForm from './NewsForm.vue'
import { action } from '@storybook/addon-actions'

export default {
  title: 'NewsForm',
  component: NewsForm,
  excludeStories: /.*Data$/
}

export const actionsData = {
  onAdditemandpreventdefaultevent: action('onAdditemandpreventdefaultevent')
}

export const Default = (args, { argTypes }) => ({
  components: { NewsForm },
  template: '<NewsForm @additemandpreventdefaultevent="onAdditemandpreventdefaultevent"/>',
  methods: actionsData
})
