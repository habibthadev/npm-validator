<script setup lang="ts">
import { computed, shallowRef, watch } from 'vue';

interface Props {
  modelValue: string;
  loading?: boolean;
  disabled?: boolean;
}

interface Emits {
  (e: 'update:modelValue', value: string): void;
  (e: 'submit'): void;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  disabled: false
});

const emit = defineEmits<Emits>();

const inputRef = shallowRef<HTMLInputElement | null>(null);

const charCount = computed(() => props.modelValue.length);
const showCharCount = computed(() => charCount.value > 180);
const isOverLimit = computed(() => charCount.value > 214);
const canSubmit = computed(() => props.modelValue.trim().length > 0 && !props.disabled);

function handleInput(e: Event) {
  const target = e.target as HTMLInputElement;
  emit('update:modelValue', target.value);
}

function handleClear() {
  emit('update:modelValue', '');
  inputRef.value?.focus();
}

function handleSubmit() {
  if (canSubmit.value) {
    emit('submit');
  }
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter' && canSubmit.value) {
    emit('submit');
  }
}

watch(() => props.modelValue, () => {
  if (inputRef.value) {
    inputRef.value.setAttribute('aria-busy', props.loading ? 'true' : 'false');
  }
});
</script>

<template>
  <div class="input-container">
    <div class="input-wrapper">
      <div class="input-icon">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </div>
      <input
        ref="inputRef"
        :value="modelValue"
        type="text"
        role="searchbox"
        aria-label="npm package name"
        autocomplete="off"
        spellcheck="false"
        autocorrect="off"
        autocapitalize="off"
        placeholder="Enter package name..."
        class="app-input"
        :disabled="disabled"
        @input="handleInput"
        @keydown="handleKeydown"
      />
      <div class="input-actions">
        <span v-if="showCharCount" :class="['char-count', { 'char-count--over': isOverLimit }]">
          {{ charCount }}/214
        </span>
        <button
          v-if="modelValue.length > 0"
          type="button"
          class="clear-button"
          aria-label="Clear input"
          @click="handleClear"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
          </svg>
        </button>
      </div>
    </div>
    <button
      type="button"
      class="check-button"
      :disabled="!canSubmit"
      @click="handleSubmit"
    >
      Check
    </button>
  </div>
</template>

<style scoped>
.input-container {
  display: flex;
  gap: 12px;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  flex: 1;
  min-width: 0;
}

.input-icon {
  position: absolute;
  left: 16px;
  color: var(--label-tertiary);
  pointer-events: none;
  display: flex;
}

.app-input {
  width: 100%;
  height: 52px;
  padding: 0 48px 0 48px;
  font-size: 16px;
  color: var(--label-primary);
  background-color: var(--fill-tertiary);
  border: none;
  border-radius: 12px;
  outline: none;
  transition: box-shadow 0.15s ease;
}

.app-input::placeholder {
  color: var(--label-tertiary);
}

.app-input:focus {
  box-shadow: inset 0 0 0 1px var(--separator);
}

.app-input:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.input-actions {
  position: absolute;
  right: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.char-count {
  font-size: 12px;
  color: var(--label-tertiary);
  font-variant-numeric: tabular-nums;
}

.char-count--over {
  color: var(--red);
  font-weight: 500;
}

.clear-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  padding: 0;
  background: none;
  border: none;
  color: var(--label-tertiary);
  border-radius: 50%;
  transition: color 0.15s, background-color 0.15s;
}

.clear-button:hover {
  color: var(--label-secondary);
  background-color: var(--fill-tertiary);
}

.check-button {
  height: 52px;
  padding: 0 24px;
  font-size: 15px;
  font-weight: 600;
  border: none;
  border-radius: 12px;
  transition: opacity 0.15s, background-color 0.15s, color 0.15s;
  white-space: nowrap;
  min-width: 90px;
  flex-shrink: 0;
}

.check-button:not(:disabled) {
  background-color: var(--blue);
  color: #ffffff;
  cursor: pointer;
}

.check-button:hover:not(:disabled) {
  opacity: 0.9;
}

.check-button:disabled {
  background-color: var(--gray-4);
  color: var(--label-tertiary);
  cursor: not-allowed;
}

@media (max-width: 480px) {
  .input-container {
    flex-direction: column;
    gap: 12px;
  }

  .check-button {
    width: 100%;
  }

  .app-input {
    height: 48px;
  }

  .check-button {
    height: 48px;
  }
}
</style>
