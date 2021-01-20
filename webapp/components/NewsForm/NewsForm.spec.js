import { mount } from '@vue/test-utils'
import NewsForm from '@/components/NewsForm/NewsForm.vue'

const mutate = jest.fn().mockResolvedValue({ write: { id: 20, title: 'Item 1', votes: 0 } })

describe('Tests for NewsForm.vue', () => {
  let wrapper

  const createComponent = (data) => {
    wrapper = mount(NewsForm, {
      mocks: {
        $apollo: {
          mutate
        }
      },
      data () {
        return {
          newsTitle: data
        }
      }
    })
  }

  afterEach(() => {
    wrapper.destroy()
  })

  describe(':buttons', () => {
    describe('click create', () => {
      describe('when input is empty', () => {
        it('is is disabled', () => {
          createComponent('')

          const createButton = wrapper.find('button.create-item-button')
          expect(createButton.attributes('disabled')).toBe('disabled')
        })
      })

      describe('when input is not empty', () => {
        it('is not disabled', async () => {
          createComponent('')
          await wrapper.find('input').setValue('Title example')
          const createButton = wrapper.find('button.create-item-button')
          expect(createButton.attributes('disabled')).toBe(undefined)
        })
      })
    })
  })
})
