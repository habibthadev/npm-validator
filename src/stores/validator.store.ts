import { shallowRef, ref, watch } from 'vue';
import { defineStore } from 'pinia';
import type { ValidationResult, ValidationStatus, SyntaxResult } from '@/types';

export const useValidatorStore = defineStore('validator', () => {
  const input = ref('');
  const status = ref<ValidationStatus>('idle');
  const result = shallowRef<ValidationResult | null>(null);
  const history = shallowRef<ValidationResult[]>([]);

  function setOptimisticSyntax(name: string, syntax: SyntaxResult) {
    result.value = {
      name,
      syntax,
      availability: 'loading',
      similar: [],
      checkedAt: new Date()
    };
    status.value = 'validating';
  }

  function commitResult(newResult: ValidationResult) {
    result.value = newResult;
    status.value = 'done';
  }

  function pushHistory(newResult: ValidationResult) {
    const existing = history.value.filter(
      h => h.name.toLowerCase() !== newResult.name.toLowerCase()
    );
    history.value = [newResult, ...existing].slice(0, 10);
  }

  function clearHistory() {
    history.value = [];
  }

  function reset() {
    input.value = '';
    status.value = 'idle';
    result.value = null;
  }

  watch(input, (val) => {
    if (val.trim() === '') {
      status.value = 'idle';
      result.value = null;
    }
  });

  return {
    input,
    status,
    result,
    history,
    setOptimisticSyntax,
    commitResult,
    pushHistory,
    clearHistory,
    reset
  };
}, {
  persist: {
    paths: ['history']
  }
});
