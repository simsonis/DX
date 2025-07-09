const fs = require('fs-extra');
const path = require('path');

const VuePlugin = {
  name: 'vue-plugin',
  version: '1.0.0',
  description: 'Vue.js template generator plugin for DX',
  author: 'DX Team',

  /**
   * Initialize the plugin
   */
  initialize() {
    console.log('🎉 Vue.js plugin initialized');
  },

  /**
   * Register plugin with DX API
   * @param {Object} api - DX Plugin API
   */
  register(api) {
    // Register Vue component template
    api.registerTemplate('vue-component', this.generateVueComponent);
    
    // Register Vue composable template
    api.registerTemplate('vue-composable', this.generateVueComposable);
    
    // Register Vue store template
    api.registerTemplate('vue-store', this.generateVueStore);

    // Register hooks
    api.registerHook('beforeGenerate', this.beforeGenerate);
    api.registerHook('afterGenerate', this.afterGenerate);

    api.log('vue-plugin', 'Vue.js templates registered successfully', 'success');
  },

  /**
   * Generate Vue component
   * @param {string} name - Component name
   * @param {Object} options - Generation options
   */
  async generateVueComponent(name, options = {}) {
    const componentTemplate = `<template>
  <div class="${name.toLowerCase()}">
    <h2>{{ title }}</h2>
    <p>{{ message }}</p>
    <button @click="handleClick">Click me</button>
  </div>
</template>

<script>
import { ref, computed } from 'vue';

export default {
  name: '${name}',
  props: {
    title: {
      type: String,
      default: '${name} Component'
    },
    initialMessage: {
      type: String,
      default: 'Hello from ${name}!'
    }
  },
  setup(props) {
    const count = ref(0);
    const message = computed(() => \`\${props.initialMessage} (clicked \${count.value} times)\`);

    const handleClick = () => {
      count.value++;
    };

    return {
      message,
      handleClick
    };
  }
};
</script>

<style scoped>
.${name.toLowerCase()} {
  padding: 20px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  margin: 10px 0;
}

.${name.toLowerCase()} h2 {
  color: #42b883;
  margin-bottom: 10px;
}

.${name.toLowerCase()} button {
  background-color: #42b883;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
}

.${name.toLowerCase()} button:hover {
  background-color: #369870;
}
</style>
`;

    const testTemplate = `import { mount } from '@vue/test-utils';
import ${name} from '../src/components/${name}.vue';

describe('${name}', () => {
  test('renders component correctly', () => {
    const wrapper = mount(${name}, {
      props: {
        title: 'Test ${name}'
      }
    });
    
    expect(wrapper.find('h2').text()).toBe('Test ${name}');
    expect(wrapper.find('.${name.toLowerCase()}')).toBeTruthy();
  });

  test('handles click events', async () => {
    const wrapper = mount(${name});
    const button = wrapper.find('button');
    
    await button.trigger('click');
    
    expect(wrapper.text()).toContain('(clicked 1 times)');
  });

  test('accepts props', () => {
    const wrapper = mount(${name}, {
      props: {
        title: 'Custom Title',
        initialMessage: 'Custom Message'
      }
    });
    
    expect(wrapper.find('h2').text()).toBe('Custom Title');
    expect(wrapper.text()).toContain('Custom Message');
  });
});
`;

    await fs.ensureDir('src/components');
    await fs.writeFile(`src/components/${name}.vue`, componentTemplate);
    await fs.writeFile(`tests/${name}.test.js`, testTemplate);

    return {
      component: `src/components/${name}.vue`,
      test: `tests/${name}.test.js`
    };
  },

  /**
   * Generate Vue composable
   * @param {string} name - Composable name
   * @param {Object} options - Generation options
   */
  async generateVueComposable(name, options = {}) {
    const composableName = name.startsWith('use') ? name : `use${name}`;
    
    const composableTemplate = `import { ref, computed, onMounted, onUnmounted } from 'vue';

/**
 * ${composableName} composable
 * @param {Object} options - Composable options
 * @returns {Object} - Composable return value
 */
export function ${composableName}(options = {}) {
  const {
    initialValue = null,
    autoUpdate = false
  } = options;

  const value = ref(initialValue);
  const isLoading = ref(false);
  const error = ref(null);

  const processedValue = computed(() => {
    if (error.value) return null;
    return value.value;
  });

  const setValue = (newValue) => {
    try {
      error.value = null;
      value.value = newValue;
    } catch (err) {
      error.value = err.message;
    }
  };

  const reset = () => {
    value.value = initialValue;
    error.value = null;
    isLoading.value = false;
  };

  const refresh = async () => {
    isLoading.value = true;
    try {
      // Simulate async operation
      await new Promise(resolve => setTimeout(resolve, 100));
      // Add your refresh logic here
      console.log('${composableName} refreshed');
    } catch (err) {
      error.value = err.message;
    } finally {
      isLoading.value = false;
    }
  };

  let updateInterval;

  onMounted(() => {
    if (autoUpdate) {
      updateInterval = setInterval(refresh, 5000);
    }
  });

  onUnmounted(() => {
    if (updateInterval) {
      clearInterval(updateInterval);
    }
  });

  return {
    value,
    processedValue,
    isLoading,
    error,
    setValue,
    reset,
    refresh
  };
}

export default ${composableName};
`;

    const testTemplate = `import { ${composableName} } from '../src/composables/${composableName}';

describe('${composableName}', () => {
  test('should initialize with default values', () => {
    const { value, isLoading, error } = ${composableName}();
    
    expect(value.value).toBe(null);
    expect(isLoading.value).toBe(false);
    expect(error.value).toBe(null);
  });

  test('should accept initial value', () => {
    const initialValue = 'test';
    const { value } = ${composableName}({ initialValue });
    
    expect(value.value).toBe(initialValue);
  });

  test('should update value', () => {
    const { value, setValue } = ${composableName}();
    
    setValue('new value');
    
    expect(value.value).toBe('new value');
  });

  test('should reset to initial value', () => {
    const initialValue = 'initial';
    const { value, setValue, reset } = ${composableName}({ initialValue });
    
    setValue('changed');
    reset();
    
    expect(value.value).toBe(initialValue);
  });
});
`;

    await fs.ensureDir('src/composables');
    await fs.writeFile(`src/composables/${composableName}.js`, composableTemplate);
    await fs.writeFile(`tests/${composableName}.test.js`, testTemplate);

    return {
      composable: `src/composables/${composableName}.js`,
      test: `tests/${composableName}.test.js`
    };
  },

  /**
   * Generate Vue store
   * @param {string} name - Store name
   * @param {Object} options - Generation options
   */
  async generateVueStore(name, options = {}) {
    const storeName = name.toLowerCase();
    
    const storeTemplate = `import { defineStore } from 'pinia';

export const use${name}Store = defineStore('${storeName}', {
  state: () => ({
    items: [],
    loading: false,
    error: null,
    selectedItem: null
  }),

  getters: {
    itemCount: (state) => state.items.length,
    hasItems: (state) => state.items.length > 0,
    filteredItems: (state) => (filter) => {
      if (!filter) return state.items;
      return state.items.filter(item => 
        item.name.toLowerCase().includes(filter.toLowerCase())
      );
    }
  },

  actions: {
    async fetchItems() {
      this.loading = true;
      this.error = null;
      
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data
        this.items = [
          { id: 1, name: 'Item 1', description: 'Description 1' },
          { id: 2, name: 'Item 2', description: 'Description 2' },
          { id: 3, name: 'Item 3', description: 'Description 3' }
        ];
      } catch (error) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },

    addItem(item) {
      const newItem = {
        id: Date.now(),
        ...item
      };
      this.items.push(newItem);
    },

    updateItem(id, updates) {
      const index = this.items.findIndex(item => item.id === id);
      if (index !== -1) {
        this.items[index] = { ...this.items[index], ...updates };
      }
    },

    deleteItem(id) {
      const index = this.items.findIndex(item => item.id === id);
      if (index !== -1) {
        this.items.splice(index, 1);
      }
    },

    selectItem(item) {
      this.selectedItem = item;
    },

    clearSelection() {
      this.selectedItem = null;
    },

    reset() {
      this.items = [];
      this.loading = false;
      this.error = null;
      this.selectedItem = null;
    }
  }
});
`;

    const testTemplate = `import { setActivePinia, createPinia } from 'pinia';
import { use${name}Store } from '../src/stores/${storeName}';

describe('${name} Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  test('should initialize with default state', () => {
    const store = use${name}Store();
    
    expect(store.items).toEqual([]);
    expect(store.loading).toBe(false);
    expect(store.error).toBe(null);
    expect(store.selectedItem).toBe(null);
  });

  test('should add item', () => {
    const store = use${name}Store();
    const newItem = { name: 'Test Item', description: 'Test Description' };
    
    store.addItem(newItem);
    
    expect(store.items).toHaveLength(1);
    expect(store.items[0].name).toBe('Test Item');
  });

  test('should update item', () => {
    const store = use${name}Store();
    store.addItem({ name: 'Original', description: 'Original Description' });
    
    const itemId = store.items[0].id;
    store.updateItem(itemId, { name: 'Updated' });
    
    expect(store.items[0].name).toBe('Updated');
  });

  test('should delete item', () => {
    const store = use${name}Store();
    store.addItem({ name: 'Test Item', description: 'Test Description' });
    
    const itemId = store.items[0].id;
    store.deleteItem(itemId);
    
    expect(store.items).toHaveLength(0);
  });

  test('should select item', () => {
    const store = use${name}Store();
    const item = { id: 1, name: 'Test Item' };
    
    store.selectItem(item);
    
    expect(store.selectedItem).toEqual(item);
  });
});
`;

    await fs.ensureDir('src/stores');
    await fs.writeFile(`src/stores/${storeName}.js`, storeTemplate);
    await fs.writeFile(`tests/${storeName}.test.js`, testTemplate);

    return {
      store: `src/stores/${storeName}.js`,
      test: `tests/${storeName}.test.js`
    };
  },

  /**
   * Before generate hook
   * @param {Object} data - Generation data
   * @returns {Object} - Modified data
   */
  beforeGenerate(data) {
    console.log('🔄 Vue plugin: Before generate hook called');
    return data;
  },

  /**
   * After generate hook
   * @param {Object} data - Generation data
   * @returns {Object} - Modified data
   */
  afterGenerate(data) {
    console.log('✅ Vue plugin: After generate hook called');
    return data;
  },

  /**
   * Cleanup function
   */
  cleanup() {
    console.log('🧹 Vue plugin cleanup');
  }
};

module.exports = VuePlugin;