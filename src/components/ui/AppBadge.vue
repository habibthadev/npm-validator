<script setup lang="ts">
import { computed } from 'vue';

type BadgeVariant = 'success' | 'error' | 'warning' | 'neutral' | 'blue';

interface Props {
  variant: BadgeVariant;
}

const props = defineProps<Props>();

const badgeClasses = computed(() => {
  return ['app-badge', `app-badge--${props.variant}`];
});
</script>

<template>
  <span :class="badgeClasses">
    <slot />
  </span>
</template>

<style scoped>
.app-badge {
  display: inline-flex;
  align-items: center;
  padding: 3px 8px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-radius: 6px;
  white-space: nowrap;
}

.app-badge--success {
  background-color: rgba(52, 199, 89, 0.15);
  color: var(--green);
}

.app-badge--error {
  background-color: rgba(255, 59, 48, 0.15);
  color: var(--red);
}

.app-badge--warning {
  background-color: rgba(255, 149, 0, 0.15);
  color: var(--orange);
}

.app-badge--neutral {
  background-color: rgba(142, 142, 147, 0.15);
  color: var(--gray);
}

.app-badge--blue {
  background-color: rgba(0, 122, 255, 0.15);
  color: var(--blue);
}
</style>
