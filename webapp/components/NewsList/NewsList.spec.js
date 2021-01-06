import { mount } from '@vue/test-utils'
import NewsList from '@/components/NewsList/NewsList.vue'
import NewsItem from '@/components/NewsItem/NewsItem.vue'

describe('Newslist.vue', () => {
  describe(':initialItems', () => {
    describe('empty', () => {
      const newsList = mount(NewsList, {
        data () {
          return {
            items: []
          }
        }
      })

      it('renders empty state', () => {
        const newsItems = newsList.findAllComponents(NewsItem)
        expect(newsItems).toHaveLength(0)
        expect(newsList.find('div.empty-list').text()).toEqual('The list is empty 😢')
      })
    })

    describe('not empty', () => {
      const newsList = mount(NewsList, {
        data () {
          return {
            items: [
              { id: 0, title: 'Item 1', votes: 1 },
              { id: 1, title: 'Item 2', votes: 0 }
            ]
          }
        }
      })

      it('renders <NewsItem> for each item', () => {
        const newsItems = newsList.findAllComponents(NewsItem)
        expect(newsItems).toHaveLength(2)
      })

      describe('click "Reverse order"', () => {
        it('toggles between ascending and descending order', async () => {
          const reverseOrderButton = newsList.find('button.reverse-order-button')

          expect(newsList.findAll('span.news-votes').wrappers.map(w => w.text())).toEqual(['(1)', '(0)'])
          await reverseOrderButton.trigger('click')
          expect(newsList.findAll('span.news-votes').wrappers.map(w => w.text())).toEqual(['(0)', '(1)'])
        })
      })
    })
  })

  describe(':editItemList', () => {
    describe('remove first item', () => {
      const newsList = mount(NewsList, {
        data () {
          return {
            items: [
              { id: 0, title: 'Item 1', votes: 0 },
              { id: 1, title: 'Item 2', votes: 0 }
            ]
          }
        }
      })

      it('second item moves to top', async () => {
        const firstNewsItemBeforeRemoval = newsList.findAllComponents(NewsItem).at(0)
        const removeButton = firstNewsItemBeforeRemoval.find('button.remove-button')
        await removeButton.trigger('click')

        const firstNewsItemAfterRemoval = newsList.findComponent(NewsItem)
        expect(firstNewsItemAfterRemoval.find('span.news-title').text())
          .toEqual('Item 2')
      })
    })
  })
})
