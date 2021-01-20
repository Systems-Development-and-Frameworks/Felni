import { mount } from '@vue/test-utils'
import NavbarLoginButton from '@/components/NavbarLoginButton/NavbarLoginButton.vue'

describe('Tests for NewsForm.vue', () => {
  let wrapper

  const createComponent = (data) => {
    wrapper = mount(NavbarLoginButton, {
      mocks: {
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
    describe('logged in', () => {
      it('reads Logout', () => {
        createComponent()

        const logoutButton = wrapper.find('.btn.btn-outline-danger')
        expect(logoutButton.exists()).toBeTruthy()
        expect(logoutButton.text()).toBe('Logout')
      })
    })
  })
})
