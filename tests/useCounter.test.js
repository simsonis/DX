import { useCounter } from '../src/composables/useCounter';

describe('useCounter', () => {
  test('should initialize with default values', () => {
    const { value, isLoading, error } = useCounter();
    
    expect(value.value).toBe(null);
    expect(isLoading.value).toBe(false);
    expect(error.value).toBe(null);
  });

  test('should accept initial value', () => {
    const initialValue = 'test';
    const { value } = useCounter({ initialValue });
    
    expect(value.value).toBe(initialValue);
  });

  test('should update value', () => {
    const { value, setValue } = useCounter();
    
    setValue('new value');
    
    expect(value.value).toBe('new value');
  });

  test('should reset to initial value', () => {
    const initialValue = 'initial';
    const { value, setValue, reset } = useCounter({ initialValue });
    
    setValue('changed');
    reset();
    
    expect(value.value).toBe(initialValue);
  });
});
