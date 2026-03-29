<script setup lang="ts">
interface Props {
  width?: string;
  height?: string;
}

withDefaults(defineProps<Props>(), {
  width: '100%',
  height: '16px'
});
</script>

<template>
  <div
    class="skeleton-shimmer"
    :style="{ width, height }"
    aria-hidden="true"
  />
</template>

<style scoped>
.skeleton-shimmer {
  border-radius: 8px;
  background: linear-gradient(
    90deg,
    var(--bg-tertiary) 25%,
    var(--bg-secondary) 50%,
    var(--bg-tertiary) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.4s ease-in-out infinite;
}

@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
</style>
