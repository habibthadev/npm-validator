<script setup lang="ts">
import { computed } from 'vue';
import type { SimilarPackage } from '@/types';
import AppBadge from '@/components/ui/AppBadge.vue';
import ScoreBar from '@/components/ui/ScoreBar.vue';
import SkeletonBlock from '@/components/ui/SkeletonBlock.vue';

interface Props {
  packages: SimilarPackage[];
  loading: boolean;
  error: boolean;
  onRetry: () => void;
}

const props = defineProps<Props>();

const sortedPackages = computed(() => {
  return [...props.packages].sort((a, b) => b.similarityScore - a.similarityScore);
});

function formatDownloads(count: number | undefined): string {
  if (!count) return '';
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M/wk`;
  }
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K/wk`;
  }
  return `${count}/wk`;
}

function getRiskBadgeVariant(level: SimilarPackage['riskLevel']) {
  switch (level) {
    case 'high':
      return 'error';
    case 'moderate':
      return 'warning';
    case 'low':
      return 'blue';
    default:
      return 'neutral';
  }
}
</script>

<template>
  <div class="similar-panel">
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
          <circle cx="18" cy="5" r="3" />
          <circle cx="6" cy="12" r="3" />
          <circle cx="18" cy="19" r="3" />
          <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
          <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
        </svg>
        <h3 class="title">Similar Packages</h3>
        <AppBadge v-if="!loading && !error" variant="neutral">{{ sortedPackages.length }}</AppBadge>
      </div>
    </div>

    <div class="panel-content">
      <div v-if="loading" class="skeleton-list">
        <div v-for="i in 6" :key="i" class="skeleton-row">
          <SkeletonBlock width="120px" height="14px" />
          <SkeletonBlock width="100%" height="6px" />
          <SkeletonBlock width="200px" height="12px" />
        </div>
      </div>

      <div v-else-if="error" class="error-state">
        <p class="error-message">Could not load similar packages</p>
        <button class="retry-button" @click="onRetry">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="23 4 23 10 17 10" />
            <polyline points="1 20 1 14 7 14" />
            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
          </svg>
          Retry
        </button>
      </div>

      <div v-else-if="sortedPackages.length === 0" class="empty-state">
        <p>No similar packages found</p>
      </div>

      <ul v-else class="package-list">
        <li
          v-for="pkg in sortedPackages"
          :key="pkg.name"
          :class="['package-item', { 'package-item--high-risk': pkg.riskLevel === 'high' }]"
        >
          <div class="package-header">
            <a :href="pkg.npmUrl" target="_blank" rel="noopener noreferrer" class="package-name">
              {{ pkg.name }}
            </a>
            <span class="package-version">{{ pkg.version }}</span>
            <AppBadge :variant="getRiskBadgeVariant(pkg.riskLevel)">{{ pkg.riskLevel }}</AppBadge>
          </div>
          <div class="package-score">
            <ScoreBar :score="pkg.similarityScore" />
          </div>
          <div class="package-meta">
            <p v-if="pkg.description" class="package-description">{{ pkg.description }}</p>
            <span v-if="pkg.weeklyDownloads" class="package-downloads">{{ formatDownloads(pkg.weeklyDownloads) }}</span>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.similar-panel {
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

.skeleton-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.skeleton-row {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.error-state {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
}

.error-message {
  font-size: 14px;
  color: var(--label-secondary);
  margin: 0;
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
}

.retry-button:hover {
  background-color: rgba(0, 122, 255, 0.15);
}

.empty-state {
  text-align: center;
  padding: 24px 0;
}

.empty-state p {
  font-size: 14px;
  color: var(--label-tertiary);
  margin: 0;
}

.package-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.package-item {
  padding: 12px;
  background-color: var(--bg-secondary);
  border-radius: 12px;
  border-left: 2px solid transparent;
}

.package-item--high-risk {
  border-left-color: rgba(255, 59, 48, 0.4);
}

.package-header {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 8px;
}

.package-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--blue);
  text-decoration: none;
}

.package-name:hover {
  text-decoration: underline;
}

.package-version {
  font-size: 11px;
  color: var(--label-tertiary);
  padding: 2px 6px;
  background-color: var(--fill-tertiary);
  border-radius: 4px;
}

.package-score {
  margin-bottom: 8px;
}

.package-meta {
  display: flex;
  align-items: center;
  gap: 12px;
}

.package-description {
  flex: 1;
  font-size: 12px;
  color: var(--label-secondary);
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.package-downloads {
  font-size: 11px;
  color: var(--label-tertiary);
  white-space: nowrap;
}
</style>
