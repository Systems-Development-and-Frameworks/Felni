import { mount } from '@vue/test-utils'
import NewsItem from '@/components/NewsItem/NewsItem.vue'

describe('NewsItem.vue', () => {
    describe(':buttons', () => {
        describe('click remove', () => {
            const newsItem = mount(NewsItem, {
                propsData: {
                    item: { id: 20, title: 'Item 1', votes: 0 }
                } 
              })

            it('emits removeitem event', async () => {
                const removeButton = newsItem.find('button.remove-button')
                removeButton.trigger('click')
                await newsItem.vm.$nextTick()

                expect(newsItem.emitted().removeitem).toBeTruthy()
                expect(newsItem.emitted().removeitem.length).toBe(1)
                expect(newsItem.emitted().removeitem[0]).toEqual([20])
              })
        })

        describe('click upvote', () => {
            const newsItem = mount(NewsItem, {
                propsData: {
                    item: { id: 20, title: 'Item 1', votes: 0 }
                } 
              })

            it('increases votes by one', async () => {
                const upvoteButton = newsItem.find('button.upvote-button')
                upvoteButton.trigger('click')
                await newsItem.vm.$nextTick()

                expect(newsItem.props().item.votes).toBe(1)
              })
        })
    })

})