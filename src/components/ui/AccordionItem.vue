<script setup lang="ts">
import { ref } from 'vue';

interface Props {
  question: string;
  answer: string;
}

defineProps<Props>();

const isOpen = ref(false);

function toggle() {
  isOpen.value = !isOpen.value;
}
</script>

<template>
  <div class="accordion-item">
    <button
      type="button"
      class="accordion-header"
      :aria-expanded="isOpen"
      @click="toggle"
    >
      <h3 class="accordion-question">{{ question }}</h3>
      <svg
        class="accordion-icon"
        :class="{ 'accordion-icon--open': isOpen }"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </button>
    <div
      class="accordion-content"
      :class="{ 'accordion-content--open': isOpen }"
    >
      <p class="accordion-answer">{{ answer }}</p>
    </div>
  </div>
</template>

<style scoped>
.accordion-item {
  background-color: var(--bg-primary);
  border-radius: 16px;
  overflow: hidden;
}

.accordion-header {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 24px 28px;
  background: none;
  border: none;
  text-align: left;
  transition: background-color 0.15s ease;
}

.accordion-header:hover {
  background-color: var(--fill-quaternary);
}

.accordion-question {
  flex: 1;
  font-size: 18px;
  font-weight: 600;
  color: var(--label-primary);
  margin: 0;
}

.accordion-icon {
  flex-shrink: 0;
  color: var(--label-tertiary);
}

.accordion-icon--open {
  transform: rotate(180deg);
  color: var(--label-secondary);
}

.accordion-content {
  max-height: 0;
  overflow: hidden;
}

.accordion-content--open {
  max-height: 500px;
  padding: 0 28px 24px;
}

.accordion-answer {
  font-size: 15px;
  color: var(--label-secondary);
  margin: 0;
  line-height: 1.7;
}

@media (max-width: 480px) {
  .accordion-header {
    padding: 20px;
  }

  .accordion-question {
    font-size: 17px;
  }

  .accordion-content--open {
    padding: 0 20px 20px;
  }

  .accordion-answer {
    font-size: 14px;
  }
}
</style>
