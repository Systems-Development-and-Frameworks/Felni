import { action } from '@storybook/addon-actions'
import NewsItem from './NewsItem.vue'

export default {
  title: 'NewsItem',
  component: NewsItem,
  excludeStories: /.*Data$/
}

export const itemData = {
  id: 1,
  title: 'Storyitem 1',
  votes: 0
}

export const actionsData = {
  onUpdateitem: action('onUpdateitem'),
  onRemoveitem: action('onRemoveitem')
}

export const Default = () => ({
  components: { NewsItem },
  template: '<NewsItem :item="item" @updateitem="onUpdateitem" @removeitem="onRemoveitem"/>',
  props: {
    item: {
      default: () => itemData
    }
  },
  methods: actionsData
})

Default.args = {
  item: { id: 1, title: 'Storyitem 1', votes: 0 }
}
