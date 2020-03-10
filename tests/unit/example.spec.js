import { mount } from '@vue/test-utils'
import searchBar from '@/components/searchBar.vue'

describe('Component', () => {
  test('is a Vue instance', () => {
    const wrapper = mount(searchBar)
    expect(wrapper.isVueInstance()).toBeTruthy()
  })
})
