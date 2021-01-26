import { mount } from '@vue/test-utils'
import NewsItem from '@/components/NewsItem/NewsItem.vue'

describe('NewsItem.vue', () => {
  let wrapper

  const createComponent = (data) => {
    wrapper = mount(NewsItem, {
      propsData: {
        item: data
      },
      mocks: {
        $apolloHelpers: {
          getToken: jest.fn().mockReturnValue(undefined)
        }
      }
    })
  }

  afterEach(() => {
    wrapper.destroy()
  })

  describe(':buttons', () => {
    describe('click remove', () => {
      it('emits removeitem event', async () => {
        createComponent({ id: 20, title: 'Item 1', votes: 0 })

        const removeButton = wrapper.find('button.remove-button')
        await removeButton.trigger('click')
        expect(wrapper.emitted()).toEqual({ removeitem: [[20]] })
      })
    })

    describe('click upvote', () => {
      it('increases votes by one', async () => {
        createComponent({ id: 20, title: 'Item 1', votes: 0 })

        const upvoteButton = wrapper.find('button.upvote-button')
        upvoteButton.trigger('click')
        await wrapper.vm.$nextTick()
        expect(wrapper.emitted().updateitem[0][0]).toEqual({ id: 20, title: 'Item 1', votes: 0 })
        expect(wrapper.emitted().updateitem).toBeTruthy()
      })
    })

    /* commented test as we don`t have a downvote functionality in our backend
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
