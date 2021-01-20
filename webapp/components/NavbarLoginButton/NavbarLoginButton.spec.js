import { mount } from '@vue/test-utils'
import NavbarLoginButton from '@/components/NavbarLoginButton/NavbarLoginButton.vue'

describe('Tests for NewsForm.vue', () => {
  let wrapper

  const createComponent = (data) => {
    wrapper = mount(NavbarLoginButton, {
      propsData: {
        loggedOut: data
      },
      stubs: {
        NuxtLink: true
      }
    })
  }

  afterEach(() => {
    wrapper.destroy()
  })

  describe(':button', () => {
    describe('not logged in', () => {
      it('reads Login', () => {
        createComponent(true)

        const loginButton = wrapper.find('.btn.btn-outline-success')
        expect(loginButton.exists()).toBeTruthy()
        expect(loginButton.text()).toBe('Login')
      })
    })
    describe('logged in', () => {
      it('reads Logout', () => {
        createComponent(false)

        const logoutButton = wrapper.find('.btn.btn-outline-danger')
        expect(logoutButton.exists()).toBeTruthy()
        expect(logoutButton.text()).toBe('Logout')
      })
    })
  })
})
