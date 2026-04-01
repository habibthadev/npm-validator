<script setup lang="ts">
import type { BundleResult } from '@/types/bundle';

interface Props {
  result: BundleResult;
  label: string;
}

defineProps<Props>();

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
}

function calculatePercentage(value: number, reference: number): number {
  return Math.round(((reference - value) / reference) * 100);
}
</script>

<template>
  <div class="bundle-result">
    <div class="result-header">
      <h3 class="result-title">{{ label }}</h3>
      <div class="result-version">v{{ result.version }}</div>
    </div>

    <div v-if="result.namedImport" class="result-import">
      <span class="import-label">import</span>
      <span class="import-value">{{ result.namedImport }}</span>
      <span class="import-label">from</span>
      <span class="import-value">'{{ result.packageName }}'</span>
    </div>

    <div class="result-sizes">
      <div class="size-card">
        <div class="size-label">Minified</div>
        <div class="size-value">{{ formatBytes(result.minifiedSize) }}</div>
      </div>

      <div class="size-card size-card--highlight">
        <div class="size-label">Gzip</div>
        <div class="size-value">{{ formatBytes(result.gzipSize) }}</div>
        <div class="size-percentage">
          {{ calculatePercentage(result.gzipSize, result.minifiedSize) }}% smaller
        </div>
      </div>

      <div class="size-card size-card--primary">
        <div class="size-label">Brotli</div>
        <div class="size-value">{{ formatBytes(result.brotliSize) }}</div>
        <div class="size-percentage">
          {{ calculatePercentage(result.brotliSize, result.minifiedSize) }}% smaller
        </div>
      </div>
    </div>

    <div v-if="result.hasESM" class="esm-badge">
      <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
        <path d="M7 0l1.545 5.255L14 7l-5.455 1.745L7 14l-1.545-5.255L0 7l5.455-1.745L7 0z"/>
      </svg>
      <span>ESM Available</span>
    </div>
  </div>
</template>

<style scoped>
.bundle-result {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 24px;
  background-color: var(--bg-primary);
  border: 1px solid var(--separator);
  border-radius: 16px;
}

.result-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.result-title {
  font-size: 20px;
  font-weight: 600;
  color: var(--label-primary);
  margin: 0;
  letter-spacing: -0.01em;
}

.result-version {
  font-size: 13px;
  font-weight: 500;
  color: var(--label-tertiary);
  padding: 4px 12px;
  background-color: var(--fill-tertiary);
  border-radius: 8px;
}

.result-import {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background-color: var(--fill-quaternary);
  border-radius: 10px;
  font-family: 'SF Mono', 'Menlo', monospace;
  font-size: 14px;
  overflow-x: auto;
}

.import-label {
  color: var(--label-tertiary);
  font-weight: 500;
}

.import-value {
  color: var(--label-primary);
  font-weight: 600;
}

.result-sizes {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 16px;
}

.size-card {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 20px;
  background-color: var(--fill-quaternary);
  border-radius: 12px;
}

.size-card--highlight {
  background-color: rgba(52, 199, 89, 0.12);
}

.size-card--primary {
  background-color: rgba(0, 122, 255, 0.12);
}

.size-label {
  font-size: 11px;
  font-weight: 600;
  color: var(--label-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.size-value {
  font-size: 28px;
  font-weight: 700;
  color: var(--label-primary);
  letter-spacing: -0.02em;
}

.size-percentage {
  font-size: 12px;
  font-weight: 500;
  color: var(--label-secondary);
}

.esm-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background-color: rgba(0, 122, 255, 0.12);
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  color: var(--blue);
  width: fit-content;
}

.esm-badge svg {
  opacity: 0.8;
}

@media (max-width: 768px) {
  .bundle-result {
    padding: 20px;
  }

  .result-title {
    font-size: 18px;
  }

  .result-sizes {
    grid-template-columns: 1fr;
  }

  .size-value {
    font-size: 24px;
  }
}
</style>
