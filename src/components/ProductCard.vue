<template>
  <div class="productcard">
    <h2>{{ title }}</h2>
    <p>{{ message }}</p>
    <button @click="handleClick">Click me</button>
  </div>
</template>

<script>
import { ref, computed } from 'vue';

export default {
  name: 'ProductCard',
  props: {
    title: {
      type: String,
      default: 'ProductCard Component'
    },
    initialMessage: {
      type: String,
      default: 'Hello from ProductCard!'
    }
  },
  setup(props) {
    const count = ref(0);
    const message = computed(() => `${props.initialMessage} (clicked ${count.value} times)`);

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
.productcard {
  padding: 20px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  margin: 10px 0;
}

.productcard h2 {
  color: #42b883;
  margin-bottom: 10px;
}

.productcard button {
  background-color: #42b883;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
}

.productcard button:hover {
  background-color: #369870;
}
</style>
