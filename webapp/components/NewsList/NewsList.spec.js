import { mount, createLocalVue } from '@vue/test-utils'
import NewsList from '@/components/NewsList/NewsList.vue'
import NewsItem from '@/components/NewsItem/NewsItem.vue'

const localVue = createLocalVue()

const mutate = jest.fn()

describe('Newslist.vue', () => {
  let wrapper

  const createComponent = (data) => {
    wrapper = mount(NewsList, {
      localVue,
      mocks: {
        $apollo: {
          mutate
        },
        $apolloHelpers: {
          getToken: jest.fn().mockResolvedValue(undefined)
        }
      },
      data () {
        return {
          items: data
        }
      }
    })
  }

  afterEach(() => {
    wrapper.destroy()
  })

  describe(':initialItems', () => {
    describe('empty', () => {
      it('renders empty state', () => {
        createComponent([])

        const newsItems = wrapper.findAllComponents(NewsItem)
        expect(newsItems).toHaveLength(0)
        expect(wrapper.find('div.empty-list').text()).toEqual('The list is empty 😢')
      })
    })

    describe('not empty', () => {
      it('renders <NewsItem> for each item', async () => {
        createComponent([
          { id: 0, title: 'Item 1', votes: 1, author: { id: 9 } },
          { id: 1, title: 'Item 2', votes: 0, author: { id: 99 } }
        ])
        await wrapper.vm.$nextTick()
        const newsItems = wrapper.findAllComponents(NewsItem)
        expect(newsItems).toHaveLength(2)
      })

      describe('click "Reverse order"', () => {
        it('toggles between ascending and descending order', async () => {
          createComponent([
            { id: 0, title: 'Item 1', votes: 1, author: { id: 9 } },
            { id: 1, title: 'Item 2', votes: 0, author: { id: 99 } }
          ])
          const reverseOrderButton = wrapper.find('button.reverse-order-button')

          expect(wrapper.findAll('span.news-votes').wrappers.map(w => w.text())).toEqual(['(1)', '(0)'])
          await reverseOrderButton.trigger('click')
          expect(wrapper.findAll('span.news-votes').wrappers.map(w => w.text())).toEqual(['(0)', '(1)'])
        })
      })
    })
  })

  describe(':editItemList', () => {
    describe('remove first item', () => {
      it('second item moves to top', async () => {
        createComponent([
          { id: 0, title: 'Item 1', votes: 1, author: { id: 9 } },
          { id: 1, title: 'Item 2', votes: 0, author: { id: 99 } }
        ])
        const firstNewsItemBeforeRemoval = wrapper.findAllComponents(NewsItem).at(0)
        const removeButton = firstNewsItemBeforeRemoval.find('button.remove-button')
        await removeButton.trigger('click')
        // await wrapper.vm.$nextTick()
        expect(mutate).toBeCalled()
        expect(mutate).toHaveBeenCalled()
        const firstNewsItemAfterRemoval = wrapper.findComponent(NewsItem)
        expect(firstNewsItemAfterRemoval.find('span.news-title').text())
          .toEqual('Item 2')
      })
    })
  })
})
