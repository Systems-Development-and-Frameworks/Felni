import { mount, createLocalVue  } from '@vue/test-utils'
import NewsList from '@/components/NewsList/NewsList.vue'
import NewsItem from '@/components/NewsItem/NewsItem.vue'
import VueApollo from 'vue-apollo'
import { createMockClient } from 'mock-apollo-client'
import gql from 'graphql-tag'
import { state } from '~/store/auth'

const postsMock = {
  data: {
    posts: [
      { id: 0, title: 'Item 1', votes: 1, author: {id: 9} },
      { id: 1, title: 'Item 2', votes: 0, author: {id: 99} },
    ],
  },
}

const localVue = createLocalVue()
localVue.use(VueApollo)

const postsQuery = gql`
query posts {
  posts {
   id
   title
   votes
   author {
     id
   }
  }
}
`

const deleteQuery = gql`
mutation deletePost($id: ID!) {
  delete(id: $id ) {
    id
  }
}
`

describe('Newslist.vue', () => {
  let wrapper
  let mockClient
  let apolloProvider
  let requestHandlers

  const createComponent = (handlers, data) => {

    requestHandlers = {
      postsQueryHandler: jest.fn().mockResolvedValue(postsMock),
      deleteMutationHandler: jest.fn().mockResolvedValue(null),
      ...handlers,
    }

    mockClient = createMockClient({
      resolvers: {},
    })

    mockClient.setRequestHandler(
      postsQuery,
      requestHandlers.postsQueryHandler
    )
    mockClient.setRequestHandler(
      deleteQuery,
      requestHandlers.deleteMutationHandler
    )

    apolloProvider = new VueApollo({
      defaultClient: mockClient,
    })
    wrapper = mount(NewsList, {
      localVue,
      apolloProvider,
      mocks: {
        $apollo: {
          mutate:
        }
      },
      data() {
        return {
          items: data,
        }
      },
    })
  }

  afterEach(() => {
    wrapper.destroy()
    mockClient = null
    apolloProvider = null
  })

  describe(':initialItems', () => {
    describe('empty', () => {
      it('renders empty state', () => {
        createComponent({
          postsQueryHandler: jest.fn().mockResolvedValue({ data: { posts: [] } })
        },[])

        expect(requestHandlers.postsQueryHandler).toHaveBeenCalled()
        const newsItems = wrapper.findAllComponents(NewsItem)
        expect(newsItems).toHaveLength(0)
        expect(wrapper.find('div.empty-list').text()).toEqual('The list is empty 😢')
      })
    })

    describe('not empty', () => {
      it('renders <NewsItem> for each item', async () => {
        //createComponent();
        createComponent({}, [
          { id: 0, title: 'Item 1', votes: 1, author: {id: 9} },
          { id: 1, title: 'Item 2', votes: 0, author: {id: 99} },
        ]);
        await wrapper.vm.$nextTick()
        expect(requestHandlers.postsQueryHandler).toHaveBeenCalled()
        const newsItems = wrapper.findAllComponents(NewsItem)
        expect(newsItems).toHaveLength(2)
      })

      /*describe('click "Reverse order"', () => {
        it('toggles between ascending and descending order', async () => {
          const reverseOrderButton = newsList.find('button.reverse-order-button')

          expect(newsList.findAll('span.news-votes').wrappers.map(w => w.text())).toEqual(['(1)', '(0)'])
          await reverseOrderButton.trigger('click')
          expect(newsList.findAll('span.news-votes').wrappers.map(w => w.text())).toEqual(['(0)', '(1)'])
        })
      })*/
    })
  })

  describe(':editItemList', () => {
    describe('remove first item', () => {
      it('second item moves to top', async () => {
        //createComponent();
        createComponent({}, [
          { id: 0, title: 'Item 1', votes: 1, author: {id: 9} },
          { id: 1, title: 'Item 2', votes: 0, author: {id: 99} },
        ]);
        const firstNewsItemBeforeRemoval = wrapper.findAllComponents(NewsItem).at(0)
        const removeButton = firstNewsItemBeforeRemoval.find('button.remove-button')
        await removeButton.trigger('click')
        await wrapper.vm.$nextTick()

        const firstNewsItemAfterRemoval = wrapper.findComponent(NewsItem)
        expect(firstNewsItemAfterRemoval.find('span.news-title').text())
          .toEqual('Item 2')
      })
    })
  })
})
