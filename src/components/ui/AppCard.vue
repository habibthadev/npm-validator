<script setup lang="ts">
</script>

<template>
  <div class="app-card">
    <slot />
  </div>
</template>

<style scoped>
.app-card {
  background-color: var(--bg-primary);
  border-radius: 16px;
  box-shadow: var(--shadow-sm);
  padding: 20px;
}
</style>
