import { shallowRef, watch, type Ref } from 'vue';

export function useDebounce<T>(value: Ref<T>, delay: number): Ref<T> {
  const debounced = shallowRef(value.value) as Ref<T>;
  let timeout: ReturnType<typeof setTimeout> | null = null;

  watch(value, (newValue) => {
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => {
      debounced.value = newValue;
    }, delay);
  });

  return debounced;
}
