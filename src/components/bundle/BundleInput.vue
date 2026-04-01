<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  modelValue: string;
  namedImport: string;
  version: string;
  disabled?: boolean;
}

interface Emits {
  (e: 'update:modelValue', value: string): void;
  (e: 'update:namedImport', value: string): void;
  (e: 'update:version', value: string): void;
  (e: 'analyze'): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const canAnalyze = computed(() => {
  return props.modelValue.trim().length > 0 && !props.disabled;
});

function handlePackageInput(e: Event) {
  const target = e.target as HTMLInputElement;
  emit('update:modelValue', target.value);
}

function handleImportInput(e: Event) {
  const target = e.target as HTMLInputElement;
  emit('update:namedImport', target.value);
}

function handleVersionInput(e: Event) {
  const target = e.target as HTMLInputElement;
  emit('update:version', target.value);
}

function handleAnalyze() {
  if (canAnalyze.value) {
    emit('analyze');
  }
}

function handleClearPackage() {
  emit('update:modelValue', '');
}

function handleClearImport() {
  emit('update:namedImport', '');
}

function handleClearVersion() {
  emit('update:version', '');
}
</script>

<template>
  <div class="analyzer-input">
    <div class="input-row">
      <div class="input-group">
        <label class="input-label">Package Name</label>
        <div class="input-wrapper">
          <input
            type="text"
            class="input-field"
            :value="modelValue"
            @input="handlePackageInput"
            placeholder="react-hook-form"
            :disabled="disabled"
          />
          <button
            v-if="modelValue"
            type="button"
            class="clear-button"
            @click="handleClearPackage"
            :disabled="disabled"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0zM4.5 4.5l7 7m-7 0l7-7" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" />
            </svg>
          </button>
        </div>
      </div>

      <div class="input-group input-group--small">
        <label class="input-label">Version (optional)</label>
        <div class="input-wrapper">
          <input
            type="text"
            class="input-field"
            :value="version"
            @input="handleVersionInput"
            placeholder="latest"
            :disabled="disabled"
          />
          <button
            v-if="version"
            type="button"
            class="clear-button"
            @click="handleClearVersion"
            :disabled="disabled"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0zM4.5 4.5l7 7m-7 0l7-7" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <div class="input-group">
      <label class="input-label">Named Import (optional)</label>
      <div class="input-wrapper">
        <input
          type="text"
          class="input-field"
          :value="namedImport"
          @input="handleImportInput"
          placeholder="useForm"
          :disabled="disabled"
        />
        <button
          v-if="namedImport"
          type="button"
          class="clear-button"
          @click="handleClearImport"
          :disabled="disabled"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0zM4.5 4.5l7 7m-7 0l7-7" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" />
          </svg>
        </button>
      </div>
    </div>

    <button
      type="button"
      class="analyze-button"
      :class="{ 'analyze-button--active': canAnalyze }"
      :disabled="!canAnalyze"
      @click="handleAnalyze"
    >
      Analyze Bundle
    </button>
  </div>
</template>

<style scoped>
.analyzer-input {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.input-row {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 16px;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.input-group--small {
  min-width: 180px;
}

.input-label {
  font-size: 13px;
  font-weight: 600;
  color: var(--label-primary);
  letter-spacing: -0.01em;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-field {
  width: 100%;
  height: 56px;
  padding: 0 48px 0 20px;
  background-color: var(--bg-primary);
  border: 1px solid var(--separator);
  border-radius: 12px;
  font-family: 'SF Pro Text', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 17px;
  color: var(--label-primary);
  transition: border-color 0.15s ease;
}

.input-field:focus {
  outline: none;
  border-color: var(--blue);
}

.input-field::placeholder {
  color: var(--label-quaternary);
}

.input-field:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.clear-button {
  position: absolute;
  right: 16px;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  cursor: pointer;
  color: var(--label-tertiary);
  transition: color 0.15s ease;
}

.clear-button:hover {
  color: var(--label-primary);
}

.clear-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.analyze-button {
  height: 56px;
  background-color: var(--fill-tertiary);
  border: 1px solid var(--separator);
  border-radius: 12px;
  font-family: 'SF Pro Text', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 17px;
  font-weight: 600;
  color: var(--label-tertiary);
  cursor: not-allowed;
  transition: all 0.15s ease;
}

.analyze-button--active {
  background-color: var(--blue);
  border-color: var(--blue);
  color: #ffffff;
  cursor: pointer;
}

.analyze-button--active:hover {
  opacity: 0.9;
}

.analyze-button--active:active {
  opacity: 0.8;
}

@media (max-width: 768px) {
  .input-row {
    grid-template-columns: 1fr;
  }

  .input-group--small {
    min-width: unset;
  }

  .input-field {
    height: 48px;
    font-size: 16px;
  }

  .analyze-button {
    height: 48px;
    font-size: 16px;
  }
}
</style>
