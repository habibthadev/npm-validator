<script setup lang="ts">
import { RouterView } from 'vue-router';
import ErrorBoundary from '@/components/ErrorBoundary.vue';
import AppHeader from '@/components/layout/AppHeader.vue';
import AppFooter from '@/components/layout/AppFooter.vue';
</script>

<template>
  <ErrorBoundary>
    <AppHeader />
    <RouterView />
    <AppFooter />
  </ErrorBoundary>
</template>
