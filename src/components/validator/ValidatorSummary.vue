<script setup lang="ts">
import { computed } from 'vue';
import type { SyntaxResult, AvailabilityStatus, SimilarPackage } from '@/types';

interface Props {
  syntax: SyntaxResult;
  availability: AvailabilityStatus;
  similar: SimilarPackage[];
}

const props = defineProps<Props>();

type Verdict = 'ready' | 'taken' | 'high-risk' | 'invalid' | 'caution';

const verdict = computed<Verdict>(() => {
  if (!props.syntax.valid) {
    return 'invalid';
  }

  if (props.availability === 'taken') {
    return 'taken';
  }

  const hasHighRisk = props.similar.some(p => p.riskLevel === 'high');
  if (hasHighRisk) {
    return 'high-risk';
  }

  const hasWarnings = props.syntax.warnings.length > 0;
  const hasModerateRisk = props.similar.some(p => p.riskLevel === 'moderate');
  if (hasWarnings || hasModerateRisk) {
    return 'caution';
  }

  if (props.availability === 'available') {
    return 'ready';
  }

  return 'caution';
});

const verdictConfig = computed(() => {
  switch (verdict.value) {
    case 'ready':
      return {
        title: 'Ready to publish',
        description: 'This package name is valid, available, and has no high-risk similar packages.',
        variant: 'success' as const,
        icon: 'check'
      };
    case 'taken':
      return {
        title: 'Name is taken',
        description: 'This package name already exists on npm. Choose a different name.',
        variant: 'error' as const,
        icon: 'x'
      };
    case 'high-risk':
      return {
        title: 'High similarity risk',
        description: 'This name is very similar to an existing package. npm may reject it or users may be confused.',
        variant: 'error' as const,
        icon: 'alert'
      };
    case 'invalid':
      return {
        title: 'Invalid name',
        description: 'This package name does not meet npm naming requirements.',
        variant: 'error' as const,
        icon: 'x'
      };
    case 'caution':
      return {
        title: 'Proceed with caution',
        description: 'This name has some concerns but may still be publishable. Review the warnings above.',
        variant: 'warning' as const,
        icon: 'alert'
      };
  }
});

const iconClass = computed(() => `summary-icon summary-icon--${verdictConfig.value.variant}`);
</script>

<template>
  <div :class="['validator-summary', `validator-summary--${verdictConfig.variant}`]">
    <div class="summary-content">
      <div :class="iconClass">
        <svg
          v-if="verdictConfig.icon === 'check'"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
        <svg
          v-else-if="verdictConfig.icon === 'x'"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
          stroke-linecap="round"
        >
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
        <svg
          v-else
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
          stroke-linecap="round"
        >
          <path d="M12 9v4" />
          <circle cx="12" cy="16" r="0.5" fill="currentColor" />
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
        </svg>
      </div>
      <div class="summary-text">
        <h3 class="summary-title">{{ verdictConfig.title }}</h3>
        <p class="summary-description">{{ verdictConfig.description }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.validator-summary {
  border-radius: 16px;
  padding: 20px;
  box-shadow: var(--shadow-sm);
}

.validator-summary--success {
  background-color: rgba(52, 199, 89, 0.1);
  border: 1px solid rgba(52, 199, 89, 0.2);
}

.validator-summary--error {
  background-color: rgba(255, 59, 48, 0.1);
  border: 1px solid rgba(255, 59, 48, 0.2);
}

.validator-summary--warning {
  background-color: rgba(255, 149, 0, 0.1);
  border: 1px solid rgba(255, 149, 0, 0.2);
}

.summary-content {
  display: flex;
  align-items: flex-start;
  gap: 16px;
}

.summary-icon {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 12px;
}

.summary-icon--success {
  background-color: var(--green);
  color: white;
}

.summary-icon--error {
  background-color: var(--red);
  color: white;
}

.summary-icon--warning {
  background-color: var(--orange);
  color: white;
}

.summary-text {
  flex: 1;
  min-width: 0;
}

.summary-title {
  font-size: 17px;
  font-weight: 600;
  color: var(--label-primary);
  margin: 0 0 4px;
}

.summary-description {
  font-size: 14px;
  color: var(--label-secondary);
  margin: 0;
  line-height: 1.4;
}
</style>
