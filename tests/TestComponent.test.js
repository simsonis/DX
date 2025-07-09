const TestComponent = require('../src/components/TestComponent');

describe('TestComponent', () => {
  test('should initialize correctly', () => {
    const component = new TestComponent();
    expect(component).toBeDefined();
  });

  test('should have default options', () => {
    const component = new TestComponent();
    expect(component.options).toEqual({});
  });
});
