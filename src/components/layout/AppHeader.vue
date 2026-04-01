<script setup lang="ts">
import { RouterLink } from 'vue-router';
import DropdownMenu from '@/components/ui/DropdownMenu.vue';

const navItems = [
  { label: 'Home', to: '/' },
  { label: 'Validator', to: '/validator' },
  { label: 'Algorithm', to: '/algorithm' },
  { label: 'Bundle Size', to: '/bundle-size' }
];
</script>

<template>
  <header class="app-header">
    <div class="header-content">
      <RouterLink to="/" class="logo">npm-validator</RouterLink>
      <nav class="header-nav desktop-nav">
        <RouterLink to="/" class="nav-link" exact-active-class="nav-link--active">Home</RouterLink>
        <RouterLink to="/validator" class="nav-link" active-class="nav-link--active">Validator</RouterLink>
        <RouterLink to="/algorithm" class="nav-link" active-class="nav-link--active">Algorithm</RouterLink>
        <RouterLink to="/bundle-size" class="nav-link" active-class="nav-link--active">Bundle Size</RouterLink>
      </nav>
      <div class="mobile-nav">
        <DropdownMenu :items="navItems" />
      </div>
    </div>
  </header>
</template>

<style scoped>
.app-header {
  border-bottom: 1px solid var(--separator);
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  height: 52px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  font-size: 17px;
  font-weight: 600;
  color: var(--label-primary);
  text-decoration: none;
}

.logo:hover {
  text-decoration: none;
}

.desktop-nav {
  display: flex;
  gap: 32px;
}

.mobile-nav {
  display: none;
}

.nav-link {
  font-size: 15px;
  font-weight: 500;
  color: var(--label-secondary);
  text-decoration: none;
}

.nav-link:hover {
  color: var(--label-primary);
  text-decoration: none;
}

.nav-link--active {
  color: var(--blue);
}

@media (max-width: 640px) {
  .desktop-nav {
    display: none;
  }

  .mobile-nav {
    display: block;
  }
}
</style>
