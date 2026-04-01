<script setup lang="ts">
import type { PackageMetadata, PackageStats } from '@/types/bundle';

interface Props {
  metadata: PackageMetadata;
  stats: PackageStats | null;
}

defineProps<Props>();

function formatNumber(num: number): string {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
}

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

function getRepoUrl(repo: { url: string }): string {
  return repo.url.replace('git+', '').replace('.git', '');
}
</script>

<template>
  <div class="package-info">
    <div class="info-header">
      <div>
        <h2 class="package-name">{{ metadata.name }}</h2>
        <p v-if="metadata.description" class="package-description">{{ metadata.description }}</p>
      </div>
    </div>

    <div class="info-grid">
      <div class="info-card">
        <div class="info-label">Version</div>
        <div class="info-value">{{ metadata.version }}</div>
      </div>

      <div v-if="metadata.license" class="info-card">
        <div class="info-label">License</div>
        <div class="info-value">{{ metadata.license }}</div>
      </div>

      <div v-if="stats" class="info-card">
        <div class="info-label">Weekly Downloads</div>
        <div class="info-value">{{ formatNumber(stats.weeklyDownloads) }}</div>
      </div>

      <div v-if="stats" class="info-card">
        <div class="info-label">Monthly Downloads</div>
        <div class="info-value">{{ formatNumber(stats.monthlyDownloads) }}</div>
      </div>

      <div v-if="stats" class="info-card">
        <div class="info-label">Last Published</div>
        <div class="info-value info-value--small">{{ formatDate(stats.lastPublish) }}</div>
      </div>
    </div>

    <div class="info-badges">
      <div v-if="metadata.hasESM" class="badge badge--success">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
          <path d="M7 0l1.545 5.255L14 7l-5.455 1.745L7 14l-1.545-5.255L0 7l5.455-1.745L7 0z"/>
        </svg>
        <span>ESM</span>
      </div>

      <div v-if="metadata.hasTypes" class="badge badge--info">
        <svg width="16" height="16" viewBox="0 0 256 256" fill="currentColor">
          <path d="M128 24a104 104 0 1 0 104 104A104.11 104.11 0 0 0 128 24Zm0 192a88 88 0 1 1 88-88 88.1 88.1 0 0 1-88 88Zm12-136v24h12a8 8 0 0 1 0 16h-12v24h12a8 8 0 0 1 0 16h-20a8 8 0 0 1-8-8V80a8 8 0 0 1 8-8h20a8 8 0 0 1 0 16Zm-48 0H80a8 8 0 0 0-8 8v80a8 8 0 0 0 16 0v-72h4a8 8 0 0 0 0-16Z"/>
        </svg>
        <span>TypeScript</span>
      </div>
    </div>

    <div v-if="metadata.dependencies && Object.keys(metadata.dependencies).length > 0" class="dependencies-section">
      <h3 class="section-title">Dependencies</h3>
      <div class="dependencies-list">
        <div v-for="(version, name) in metadata.dependencies" :key="name" class="dependency-item">
          <span class="dependency-name">{{ name }}</span>
          <span class="dependency-version">{{ version }}</span>
        </div>
      </div>
    </div>

    <div v-if="metadata.repository || metadata.homepage" class="links-section">
      <a
        v-if="metadata.repository"
        :href="getRepoUrl(metadata.repository)"
        target="_blank"
        rel="noopener noreferrer"
        class="link-button"
      >
        <svg width="16" height="16" viewBox="0 0 256 256" fill="currentColor">
          <path d="M208.31 75.68A59.78 59.78 0 0 0 202.93 28a8 8 0 0 0-6.93-4a59.75 59.75 0 0 0-48 24h-24a59.75 59.75 0 0 0-48-24 8 8 0 0 0-6.93 4 59.78 59.78 0 0 0-5.38 47.68A58.14 58.14 0 0 0 56 104v8a56.06 56.06 0 0 0 48.44 55.47A39.8 39.8 0 0 0 96 192v8H72a24 24 0 0 1-24-24a40 40 0 0 0-40-40 8 8 0 0 0 0 16 24 24 0 0 1 24 24 40 40 0 0 0 40 40h24v16a8 8 0 0 0 16 0v-40a24 24 0 0 1 48 0v40a8 8 0 0 0 16 0v-40a39.8 39.8 0 0 0-8.44-24.53A56.06 56.06 0 0 0 216 112v-8a58.14 58.14 0 0 0-7.69-28.32ZM200 112a40 40 0 0 1-40 40h-48a40 40 0 0 1-40-40v-8a41.74 41.74 0 0 1 6.9-22.48a8 8 0 0 0 1.1-7.69 43.81 43.81 0 0 1 .79-33.58a43.88 43.88 0 0 1 32.32 20.06a8 8 0 0 0 6.71 3.69h32.35a8 8 0 0 0 6.74-3.69 43.87 43.87 0 0 1 32.32-20.06 43.81 43.81 0 0 1 .77 33.58 8.09 8.09 0 0 0 1 7.65 41.72 41.72 0 0 1 7 22.52Z"/>
        </svg>
        <span>Repository</span>
      </a>

      <a
        v-if="metadata.homepage"
        :href="metadata.homepage"
        target="_blank"
        rel="noopener noreferrer"
        class="link-button"
      >
        <svg width="16" height="16" viewBox="0 0 256 256" fill="currentColor">
          <path d="M224 48h-96v160h96a8 8 0 0 0 8-8V56a8 8 0 0 0-8-8Zm-8 144h-72V64h72ZM112 48H32a8 8 0 0 0-8 8v144a8 8 0 0 0 8 8h80Zm-8 144H40V64h64Zm-32-72v48a8 8 0 0 1-16 0v-48a8 8 0 0 1 16 0Zm88 0v48a8 8 0 0 1-16 0v-48a8 8 0 0 1 16 0Z"/>
        </svg>
        <span>Homepage</span>
      </a>
    </div>
  </div>
</template>

<style scoped>
.package-info {
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 32px;
  background-color: var(--bg-primary);
  border: 1px solid var(--separator);
  border-radius: 20px;
}

.info-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
}

.package-name {
  font-size: 28px;
  font-weight: 700;
  color: var(--label-primary);
  margin: 0 0 8px 0;
  letter-spacing: -0.02em;
}

.package-description {
  font-size: 15px;
  color: var(--label-secondary);
  margin: 0;
  line-height: 1.5;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 12px;
}

.info-card {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 16px;
  background-color: var(--fill-quaternary);
  border-radius: 12px;
}

.info-label {
  font-size: 11px;
  font-weight: 600;
  color: var(--label-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.info-value {
  font-size: 20px;
  font-weight: 700;
  color: var(--label-primary);
  letter-spacing: -0.01em;
}

.info-value--small {
  font-size: 16px;
  font-weight: 600;
}

.info-badges {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
}

.badge--success {
  background-color: rgba(52, 199, 89, 0.12);
  color: var(--green);
}

.badge--info {
  background-color: rgba(0, 122, 255, 0.12);
  color: var(--blue);
}

.dependencies-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.section-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--label-primary);
  margin: 0;
}

.dependencies-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 200px;
  overflow-y: auto;
}

.dependency-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 16px;
  background-color: var(--fill-quaternary);
  border-radius: 8px;
  font-size: 13px;
}

.dependency-name {
  font-weight: 500;
  color: var(--label-primary);
}

.dependency-version {
  font-weight: 400;
  color: var(--label-tertiary);
  font-family: 'SF Mono', 'Menlo', monospace;
}

.links-section {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.link-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background-color: var(--fill-tertiary);
  border: 1px solid var(--separator);
  border-radius: 10px;
  font-size: 14px;
  font-weight: 500;
  color: var(--label-primary);
  text-decoration: none;
  transition: background-color 0.15s ease;
}

.link-button:hover {
  background-color: var(--fill-secondary);
}

@media (max-width: 768px) {
  .package-info {
    padding: 24px;
  }

  .package-name {
    font-size: 24px;
  }

  .info-grid {
    grid-template-columns: 1fr 1fr;
  }
}
</style>
