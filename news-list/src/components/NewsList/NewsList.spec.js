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
    describe('add two items to a empty list', () => {
      const elem = document.createElement('div')
      if (document.body) {
        document.body.appendChild(elem)
      }

      const newsList = mount(NewsList, {
        data () {
          return {
            items: []
          }
        },
        attachTo: elem
      })

      it('has two new items', async () => {
        const titleInput = newsList.find('input.title-input')
        await titleInput.setValue('Jest Item 1')
        await newsList.find('button.create-item-button').trigger('click')
        await titleInput.setValue('Jest Item 2')
        await newsList.find('button.create-item-button').trigger('click')
        await newsList.vm.$nextTick()

        const newsItems = newsList.findAllComponents(NewsItem)
        expect(newsItems).toHaveLength(2)
      })
    })

    describe('upvote last item', () => {
      const newsList = mount(NewsList, {
        data () {
          return {
            items: [
              { id: 0, title: 'Item 1', votes: 0 },
              { id: 1, title: 'Item 2', votes: 0 }
            ]
          }
        },
        computed: {
          sortItems: function () {
            return [...this.items].sort((item1, item2) => {
              return (item1.votes > item2.votes ? -1 : 1)
            })
          }
        }
      })

      it('moves last item to top', async () => {
        const lastNewsItemBeforeUpvote = newsList.findAllComponents(NewsItem).at(1)
        await lastNewsItemBeforeUpvote.find('button.upvote-button').trigger('click')
        const firstNewsItemAfterUpvote = newsList.findComponent(NewsItem)
        expect(firstNewsItemAfterUpvote.find('span.news-title').text())
          .toEqual(lastNewsItemBeforeUpvote.find('span.news-title').text())
        expect(firstNewsItemAfterUpvote.find('span.news-votes').text())
          .toEqual('(1)')
      })
    })

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
        const secondNewsItemBeforeRemoval = newsList.findAllComponents(NewsItem).at(1)
        const removeButton = firstNewsItemBeforeRemoval.find('button.remove-button')
        await removeButton.trigger('click')

        const firstNewsItemAfterRemoval = newsList.findComponent(NewsItem)
        expect(firstNewsItemAfterRemoval.find('span.news-title').text())
          .toEqual(secondNewsItemBeforeRemoval.find('span.news-title').text())
      })
    })
  })
})
