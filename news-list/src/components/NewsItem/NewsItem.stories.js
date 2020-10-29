import NewsItem from './NewsItem.vue'

export default {
    title: 'NewsItem',
    component: NewsItem,
    excludeStories: /.*Data$/,
}

export const itemData = {
    id: 1,
    title: 'Storyitem 1',
    votes: 0
}

export const Story = () => ({
    components: { NewsItem },
    template: '<NewsItem :item="item" />',
    props: {
        item: {
            default: () => itemData
        }
    }
})