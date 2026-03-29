<script setup lang="ts">
import { computed } from 'vue';
import type { SyntaxResult } from '@/types';

interface Props {
  result: SyntaxResult;
  hasInput: boolean;
}

const props = defineProps<Props>();

const isValid = computed(() => props.result.valid);
const hasErrors = computed(() => props.result.errors.length > 0);
const hasWarnings = computed(() => props.result.warnings.length > 0);
const showSuccessState = computed(() => isValid.value && !hasWarnings.value);
</script>

<template>
  <div class="syntax-panel">
    <div class="panel-header">
      <div class="header-title">
        <svg
          v-if="hasErrors"
          class="icon icon--error"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="15" y1="9" x2="9" y2="15" />
          <line x1="9" y1="9" x2="15" y2="15" />
        </svg>
        <svg
          v-else
          class="icon icon--success"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
        <h3 class="title">Syntax</h3>
      </div>
    </div>

    <div class="panel-content">
      <ul v-if="hasErrors || hasWarnings" class="message-list">
        <li
          v-for="error in result.errors"
          :key="error.code"
          class="message-item message-item--error"
          role="alert"
        >
          <svg
            class="message-icon"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
          </svg>
          <span>{{ error.message }}</span>
        </li>
        <li
          v-for="warning in result.warnings"
          :key="warning.code"
          class="message-item message-item--warning"
        >
          <svg
            class="message-icon"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path d="M12 9v4" />
            <circle cx="12" cy="16" r="0.5" fill="currentColor" />
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          </svg>
          <span>{{ warning.message }}</span>
        </li>
      </ul>

      <div v-else-if="showSuccessState" class="success-state">
        <svg
          class="success-icon"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
        <span>Passes all naming rules</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.syntax-panel {
  background-color: var(--bg-primary);
  border-radius: 16px;
  box-shadow: var(--shadow-sm);
  overflow: hidden;
}

.panel-header {
  padding: 16px 20px;
  border-bottom: 1px solid var(--separator);
}

.header-title {
  display: flex;
  align-items: center;
  gap: 8px;
}

.icon {
  flex-shrink: 0;
}

.icon--success {
  color: var(--green);
}

.icon--error {
  color: var(--red);
}

.title {
  font-size: 15px;
  font-weight: 600;
  color: var(--label-primary);
  margin: 0;
}

.panel-content {
  padding: 16px 20px;
}

.message-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.message-item {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-size: 14px;
  line-height: 1.4;
}

.message-item--error {
  color: var(--red);
}

.message-item--warning {
  color: var(--orange);
}

.message-icon {
  flex-shrink: 0;
  margin-top: 1px;
}

.success-state {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--green);
  font-size: 14px;
}

.success-icon {
  flex-shrink: 0;
}
</style>
