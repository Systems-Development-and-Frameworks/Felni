import { mount } from '@vue/test-utils'
import NewsItem from '@/components/NewsItem/NewsItem.vue'

describe('NewsItem.vue', () => {
  describe(':buttons', () => {
    let newsItem
    beforeEach(() => {
      newsItem = mount(NewsItem, {
        propsData: {
          item: { id: 20, title: 'Item 1', votes: 0 }
        }
      })
    })
    describe('click remove', () => {
      it('emits removeitem event', async () => {
        const removeButton = newsItem.find('button.remove-button')
        await removeButton.trigger('click')
        expect(newsItem.emitted()).toEqual({ removeitem: [[20]] })
      })
    })

    describe('click upvote', () => {
      it('increases votes by one', async () => {
        const upvoteButton = newsItem.find('button.upvote-button')
        upvoteButton.trigger('click')
        await newsItem.vm.$nextTick()

        expect(newsItem.vm._data.mutableItem.votes).toBe(1)
      })
    })

    describe('click downvote', () => {
      it('decreases votes by one', async () => {
        const upvoteButton = newsItem.find('button.downvote-button')
        upvoteButton.trigger('click')
        await newsItem.vm.$nextTick()

        expect(newsItem.vm._data.mutableItem.votes).toBe(-1)
      })
    })
  })
})
