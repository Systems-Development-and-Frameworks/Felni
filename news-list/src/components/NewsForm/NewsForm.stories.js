import NewsForm from './NewsForm.vue'
import { action } from '@storybook/addon-actions'

export default {
  title: 'NewsForm',
  component: NewsForm,
  excludeStories: /.*Data$/,
  argTypes: {
    newsTitle: { control: 'text' }
  }
}

export const actionsData = {
  onReverseOrdering: action('onReverseOrdering'),
  onAdditemandpreventdefaultevent: action('onAdditemandpreventdefaultevent')
}

export const Default = (args, { argTypes }) => ({
  components: { NewsForm },
  template: '<NewsForm @reverseordering="onReverseOrdering" @additemandpreventdefaultevent="onAdditemandpreventdefaultevent"/>',
  methods: actionsData
})

const Template = (args, { argTypes }) => ({
  components: { NewsForm },
  template: '<NewsForm @reverseordering="onReverseOrdering" @additemandpreventdefaultevent="onAdditemandpreventdefaultevent"/>',
  data () {
    return {
      newsTitle: args.newsTitle
    }
  },
  methods: actionsData
})

export const Activated = Template.bind({})
Activated.args = {
  newsTitle: 'A different text'
}
