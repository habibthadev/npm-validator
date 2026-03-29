<script setup lang="ts">
import { RouterLink } from 'vue-router';
import AppHeader from '@/components/layout/AppHeader.vue';
import AppFooter from '@/components/layout/AppFooter.vue';
</script>

<template>
  <div class="not-found-view">
    <AppHeader />

    <main class="main-content">
      <div class="content-wrapper">
        <div class="error-icon">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M16 16s-1.5-2-4-2-4 2-4 2" />
            <line x1="9" y1="9" x2="9.01" y2="9" />
            <line x1="15" y1="9" x2="15.01" y2="9" />
          </svg>
        </div>
        <h1 class="title">Page not found</h1>
        <p class="description">The page you're looking for doesn't exist or has been moved.</p>
        <RouterLink to="/" class="home-link">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          Back to home
        </RouterLink>
      </div>
    </main>

    <AppFooter />
  </div>
</template>

<style scoped>
.not-found-view {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: var(--bg-secondary);
}

.main-content {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 48px 24px;
}

.content-wrapper {
  text-align: center;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.error-icon {
  color: var(--label-tertiary);
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.title {
  font-size: 28px;
  font-weight: 600;
  color: var(--label-primary);
  margin: 0 0 12px;
}

.description {
  font-size: 16px;
  color: var(--label-secondary);
  margin: 0 0 32px;
  line-height: 1.5;
}

.home-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  font-size: 15px;
  font-weight: 500;
  color: #fff;
  background-color: var(--blue);
  border-radius: 12px;
  text-decoration: none;
  transition: opacity 0.15s;
}

.home-link:hover {
  opacity: 0.85;
  text-decoration: none;
}
</style>
