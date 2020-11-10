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
      describe('when input is empty', () => {
        it('is is disabled', () => {
          const createButton = newsForm.find('button.create-item-button')
          expect(createButton.attributes('disabled')).toBe('disabled')
        })
      })

      describe('when input is not empty', () => {
        beforeEach(async () => {
          await newsForm.find('input').setValue('Title example')
        })
        it('is not disabled', async () => {
          const createButton = newsForm.find('button.create-item-button')
          expect(createButton.attributes('disabled')).toBe(undefined)
        })
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

        expect(newsForm.emitted()).toEqual({ reverseordering: [[]] })
      })
    })
  })
})