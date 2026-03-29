<script setup lang="ts">
import { computed, onMounted, shallowRef } from 'vue';

interface Props {
  score: number;
}

const props = defineProps<Props>();

const mounted = shallowRef(false);

onMounted(() => {
  requestAnimationFrame(() => {
    mounted.value = true;
  });
});

const barColor = computed(() => {
  if (props.score >= 85) return 'var(--red)';
  if (props.score >= 65) return 'var(--orange)';
  if (props.score >= 40) return 'var(--blue)';
  return 'var(--green)';
});

const barWidth = computed(() => {
  return mounted.value ? `${props.score}%` : '0%';
});
</script>

<template>
  <div class="score-bar-wrapper">
    <div class="score-bar-track">
      <div
        class="score-bar-fill"
        :style="{ width: barWidth, backgroundColor: barColor }"
      />
    </div>
    <span class="score-value" :style="{ color: barColor }">{{ score }}</span>
  </div>
</template>

<style scoped>
.score-bar-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
}

.score-bar-track {
  flex: 1;
  height: 4px;
  background-color: var(--fill-tertiary);
  border-radius: 2px;
  overflow: hidden;
}

.score-bar-fill {
  height: 100%;
  border-radius: 2px;
  transition: width 0.5s ease-out;
}

.score-value {
  font-size: 12px;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  min-width: 24px;
  text-align: right;
}
</style>
