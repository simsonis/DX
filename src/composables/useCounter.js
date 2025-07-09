import { ref, computed, onMounted, onUnmounted } from 'vue';

/**
 * useCounter composable
 * @param {Object} options - Composable options
 * @returns {Object} - Composable return value
 */
export function useCounter(options = {}) {
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
      console.log('useCounter refreshed');
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

export default useCounter;
