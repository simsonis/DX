import { mount } from '@vue/test-utils';
import ProductCard from '../src/components/ProductCard.vue';

describe('ProductCard', () => {
  test('renders component correctly', () => {
    const wrapper = mount(ProductCard, {
      props: {
        title: 'Test ProductCard'
      }
    });
    
    expect(wrapper.find('h2').text()).toBe('Test ProductCard');
    expect(wrapper.find('.productcard')).toBeTruthy();
  });

  test('handles click events', async () => {
    const wrapper = mount(ProductCard);
    const button = wrapper.find('button');
    
    await button.trigger('click');
    
    expect(wrapper.text()).toContain('(clicked 1 times)');
  });

  test('accepts props', () => {
    const wrapper = mount(ProductCard, {
      props: {
        title: 'Custom Title',
        initialMessage: 'Custom Message'
      }
    });
    
    expect(wrapper.find('h2').text()).toBe('Custom Title');
    expect(wrapper.text()).toContain('Custom Message');
  });
});
