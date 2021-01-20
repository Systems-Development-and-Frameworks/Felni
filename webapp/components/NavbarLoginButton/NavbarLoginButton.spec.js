import { mount } from '@vue/test-utils'
import NavbarLoginButton from '@/components/NavbarLoginButton/NavbarLoginButton.vue'

describe('Tests for NewsForm.vue', () => {
  let wrapper

  const createComponent = (data, token) => {
    wrapper = mount(NavbarLoginButton, {
      mocks: {
        $store: {
          state: { auth: { token } }
        },
        $apolloHelpers: {
          getToken: jest.fn().mockResolvedValue(undefined)
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

  describe(':button', () => {
    describe('not logged in', () => {
      it('reads Login', () => {
        createComponent('')

        const loginButton = wrapper.find('.btn.btn-outline-success')
        expect(loginButton.exists()).toBeTruthy()
        expect(loginButton.text()).toBe('Login')
      })
    })
    describe('logged in', () => {
      it('reads Logout', () => {
        createComponent('apollo-token')

        const logoutButton = wrapper.find('.btn.btn-outline-danger')
        expect(logoutButton.exists()).toBeTruthy()
        expect(logoutButton.text()).toBe('Logout')
      })
    })
  })
})
