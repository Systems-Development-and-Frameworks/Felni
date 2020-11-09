import { mount } from '@vue/test-utils'
import NewsForm from '@/components/NewsForm/NewsForm.vue'

describe('Tests for NewsForm.vue', () => {
  describe(':buttons', () => {
    describe('click create', () => {
      let newsForm
      beforeEach(() => {
        newsForm = mount(NewsForm, {
          data () {
            return {
              newsTitle: ''
            }
          }
        })
      })

      it('is disabled when input is empty', async () => {
        const createButton = newsForm.find('button.create-item-button')

        expect(createButton.attributes('disabled')).toBe('disabled')
      })

      it('is not disabled when input is not empty', async () => {
        const titleInput = newsForm.find('input.title-input')
        await titleInput.setValue('Title example')
        await newsForm.vm.$nextTick()

        const createButton = newsForm.find('button.create-item-button')

        expect(createButton.attributes('disabled')).toBe(undefined)
      })
    })

    describe('click reverse order', () => {
      let newsForm
      beforeEach(() => {
        newsForm = mount(NewsForm, {
          data () {
            return {
              newsTitle: ''
            }
          }
        })
      })

      it('emits reverseordering event', async () => {
        const reverseOrderButton = newsForm.find('button.reverse-order-button')
        reverseOrderButton.trigger('click')
        await newsForm.vm.$nextTick()

        expect(newsForm.emitted().reverseordering).toBeTruthy()
        expect(newsForm.emitted().reverseordering.length).toBe(1)
      })
    })
  })
})
