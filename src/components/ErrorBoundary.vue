<script setup lang="ts">
import { shallowRef, onErrorCaptured } from 'vue';

const error = shallowRef<Error | null>(null);

onErrorCaptured((err) => {
  error.value = err instanceof Error ? err : new Error(String(err));
  return false;
});

function handleRetry() {
  error.value = null;
}
</script>

<template>
  <slot v-if="!error" />
  <div v-else class="error-boundary">
    <div class="error-content">
      <div class="error-icon">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <circle cx="12" cy="16" r="0.5" fill="currentColor" />
        </svg>
      </div>
      <h2 class="error-title">Something went wrong</h2>
      <p class="error-message">An unexpected error occurred. Please try again.</p>
      <button class="retry-button" @click="handleRetry">Try again</button>
    </div>
  </div>
</template>

<style scoped>
.error-boundary {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 24px;
}

.error-content {
  text-align: center;
  max-width: 400px;
}

.error-icon {
  color: var(--label-tertiary);
  margin-bottom: 16px;
}

.error-title {
  font-size: 22px;
  font-weight: 600;
  color: var(--label-primary);
  margin: 0 0 8px;
}

.error-message {
  font-size: 15px;
  color: var(--label-secondary);
  margin: 0 0 24px;
}

.retry-button {
  background-color: var(--blue);
  color: #fff;
  border: none;
  padding: 12px 24px;
  font-size: 15px;
  font-weight: 500;
  border-radius: 12px;
  transition: opacity 0.2s;
}

.retry-button:hover {
  opacity: 0.85;
}
</style>
