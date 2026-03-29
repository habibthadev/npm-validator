<script setup lang="ts">
import { computed } from 'vue';
import type { AvailabilityStatus } from '@/types';
import AppBadge from '@/components/ui/AppBadge.vue';
import SkeletonBlock from '@/components/ui/SkeletonBlock.vue';

interface Props {
  status: AvailabilityStatus;
  packageName: string;
  onRetry: () => void;
}

const props = defineProps<Props>();

const npmUrl = computed(() => {
  const name = encodeURIComponent(props.packageName).replace(/%40/g, '@');
  return `https://www.npmjs.com/package/${name}`;
});

const badgeVariant = computed(() => {
  switch (props.status) {
    case 'available':
      return 'success';
    case 'taken':
      return 'error';
    case 'error':
      return 'error';
    default:
      return 'neutral';
  }
});

const badgeText = computed(() => {
  switch (props.status) {
    case 'available':
      return 'Available';
    case 'taken':
      return 'Taken';
    case 'error':
      return 'Error';
    case 'unknown':
      return 'Unknown';
    default:
      return 'Checking';
  }
});
</script>

<template>
  <div class="availability-panel">
    <div class="panel-header">
      <div class="header-title">
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="icon"
        >
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
          <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
          <line x1="12" y1="22.08" x2="12" y2="12" />
        </svg>
        <h3 class="title">Registry</h3>
      </div>
    </div>

    <div class="panel-content">
      <div v-if="status === 'loading'" class="skeleton-wrapper">
        <SkeletonBlock width="100%" height="48px" />
      </div>

      <div v-else class="status-content">
        <div class="status-row">
          <AppBadge :variant="badgeVariant">{{ badgeText }}</AppBadge>
        </div>

        <p v-if="status === 'available'" class="status-message status-message--success">
          This name is free to use
        </p>

        <div v-else-if="status === 'taken'" class="status-message">
          <a :href="npmUrl" target="_blank" rel="noopener noreferrer" class="npm-link">
            View on npm
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
          </a>
        </div>

        <div v-else-if="status === 'error'" class="error-state">
          <p class="status-message status-message--error">Could not check availability</p>
          <button class="retry-button" @click="onRetry">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="23 4 23 10 17 10" />
              <polyline points="1 20 1 14 7 14" />
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
            </svg>
            Retry
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.availability-panel {
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
  color: var(--label-secondary);
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

.skeleton-wrapper {
  min-height: 48px;
}

.status-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.status-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.status-message {
  font-size: 14px;
  color: var(--label-secondary);
  margin: 0;
}

.status-message--success {
  color: var(--green);
}

.status-message--error {
  color: var(--red);
}

.npm-link {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  color: var(--blue);
  text-decoration: none;
}

.npm-link:hover {
  text-decoration: underline;
}

.error-state {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.retry-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 500;
  color: var(--blue);
  background-color: rgba(0, 122, 255, 0.1);
  border: none;
  border-radius: 8px;
  transition: background-color 0.15s;
  align-self: flex-start;
}

.retry-button:hover {
  background-color: rgba(0, 122, 255, 0.15);
}
</style>
