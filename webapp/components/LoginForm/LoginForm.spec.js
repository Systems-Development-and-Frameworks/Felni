import { createLocalVue, mount } from '@vue/test-utils'
import LoginForm from '@/components/LoginForm/LoginForm.vue'

describe('Tests for NewsForm.vue', () => {
  let wrapper

  const localVue = createLocalVue()

  const mutate = jest.fn().mockResolvedValue({ data: { login: '', signup: '' } })

  const createComponent = (data) => {
    wrapper = mount(LoginForm, {
      localVue,
      mocks: {
        $apollo: {
          mutate
        },
        $apolloHelpers: {
          onLogin: jest.fn()
        },
        $store: {
          commit: jest.fn()
        },
        $router: {
          push: jest.fn
        }
      },
      data () {
        return {
          ...data
        }
      }
    })
  }

  afterEach(() => {
    wrapper.destroy()
  })

  describe('LoginForm', () => {
    describe('initial load', () => {
      it('inputs are empty', () => {
        createComponent()

        const nameInput = wrapper.find('#signupInputName')
        expect(nameInput.element.value).toBe('')
      })
    })
    describe('after input', () => {
      it('has input', () => {
        createComponent({
          loginMail: '',
          loginPassword: '',
          signupName: 'test',
          signupMail: '',
          signupPassword: ''
        })

        const nameInput = wrapper.find('#signupInputName')
        expect(nameInput.element.value).toBe('test')
      })
    })
    describe('after login', () => {
      it('login mutation has to to be called', async () => {
        createComponent([])
        await wrapper.find('form').trigger('submit.prevent')
        await wrapper.vm.$nextTick()
        expect(mutate).toBeCalled()
      })
    })
    describe('after signup', () => {
      it('signup mutation has to be called', async () => {
        createComponent()

        const signupButton = wrapper.find('#signupButton')
        await signupButton.trigger('click')
        await wrapper.vm.$nextTick()
        expect(mutate).toBeCalled()
      })
    })
  })
})
