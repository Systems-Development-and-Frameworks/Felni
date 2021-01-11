import { action } from '@storybook/addon-actions'
import NewsForm from './NewsForm.vue'

export default {
  title: 'NewsForm',
  component: NewsForm,
  excludeStories: /.*Data$/
}

export const actionsData = {
  onAdditemandpreventdefaultevent: action('onAdditemandpreventdefaultevent')
}

export const Default = () => ({
  components: { NewsForm },
  template: '<NewsForm @additemandpreventdefaultevent="onAdditemandpreventdefaultevent"/>',
  methods: actionsData
})
