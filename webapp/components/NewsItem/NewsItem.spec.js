import { mount } from '@vue/test-utils'
import NewsItem from '@/components/NewsItem/NewsItem.vue'

describe('NewsItem.vue', () => {
  let wrapper

  let mutate = jest.fn()

  const createComponent = (data, mutate) => {
    wrapper = mount(NewsItem, {
      mocks: {
        $apollo: {
          mutate
        },
        $apolloHelpers: {
          getToken: jest.fn().mockResolvedValue(undefined)
        }
      },
      propsData: {
        item: data
      }
    })
  }

  afterEach(() => {
    wrapper.destroy()
  })

  describe(':buttons', () => {
    describe('click remove', () => {
      it('emits removeitem event', async () => {
        createComponent({ id: 20, title: 'Item 1', votes: 0 }, mutate)

        const removeButton = wrapper.find('button.remove-button')
        await removeButton.trigger('click')
        expect(wrapper.emitted()).toEqual({ removeitem: [[20]] })
      })
    })

    describe('click upvote', () => {
      it('increases votes by one', async () => {
        mutate = jest.fn().mockResolvedValue({ upvote: { id: 20, title: 'Item 1', votes: 1 } })
        createComponent({ id: 20, title: 'Item 1', votes: 0 }, mutate)

        const upvoteButton = wrapper.find('button.upvote-button')
        upvoteButton.trigger('click')
        await wrapper.vm.$nextTick()
        expect(mutate).toHaveBeenCalled()
        expect(mutate).toBeCalled()

        expect(wrapper.vm._data.mutableItem.votes).toBe(1)
      })
    })

    /* TODO implement down vote button
    describe('click downvote', () => {
      it('decreases votes by one', async () => {
        createComponent({ id: 20, title: 'Item 1', votes: 0 }, jest.fn().mockResolvedValue({upvote: { id: 20, title: 'Item 1', votes: -1 }}))

        const upvoteButton = wrapper.find('button.downvote-button')
        upvoteButton.trigger('click')
        await wrapper.vm.$nextTick()

        expect(wrapper.vm._data.mutableItem.votes).toBe(-1)
      })
    }) */
  })
})
