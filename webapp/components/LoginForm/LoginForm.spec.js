import { mount } from '@vue/test-utils'
import LoginForm from '@/components/LoginForm/LoginForm.vue'

describe('Tests for NewsForm.vue', () => {
  let wrapper

  const mutate = jest.fn()

  const createComponent = (data, mutate) => {
    wrapper = mount(LoginForm, {
      mocks: {
        $apollo: {
          mutate
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
        createComponent()

        const loginButton = wrapper.find('#loginButton')
        await loginButton.trigger('click')
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
