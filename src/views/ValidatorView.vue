<script setup lang="ts">
import { computed, watch, shallowRef, onMounted, onUnmounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useValidatorStore } from '@/stores/validator.store';
import { useValidator } from '@/composables/useValidator';
import AppInput from '@/components/ui/AppInput.vue';
import SyntaxPanel from '@/components/validator/SyntaxPanel.vue';
import AvailabilityPanel from '@/components/validator/AvailabilityPanel.vue';
import SimilarPackagesPanel from '@/components/validator/SimilarPackagesPanel.vue';
import ValidatorSummary from '@/components/validator/ValidatorSummary.vue';

const store = useValidatorStore();
const { input } = storeToRefs(store);

const {
  processedInput,
  wasUrlExtracted,
  syntaxResult,
  availability,
  similarPackages,
  isLoading,
  isDone,
  searchError,
  hasSubmitted,
  validationResult,
  submit,
  retryRegistry,
  retrySearch
} = useValidator(input);

const isOnline = shallowRef(navigator.onLine);
const resultsVisible = shallowRef(false);

const hasInput = computed(() => processedInput.value.length > 0);
const showResults = computed(() => hasSubmitted.value);
const showSummary = computed(() => {
  return hasSubmitted.value &&
    syntaxResult.value.errors.length === 0 &&
    availability.value !== 'loading' &&
    !isLoading.value;
});

watch(hasSubmitted, (val) => {
  if (val && !resultsVisible.value) {
    requestAnimationFrame(() => {
      resultsVisible.value = true;
    });
  } else if (!val) {
    resultsVisible.value = false;
  }
});

watch([isDone, validationResult], ([done, result]) => {
  if (done && result && result.syntax.valid && result.availability !== 'loading') {
    store.pushHistory(result);
  }
});

function handleSubmit() {
  submit();
}

function handleOnline() {
  isOnline.value = true;
}

function handleOffline() {
  isOnline.value = false;
}

onMounted(() => {
  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);
});

onUnmounted(() => {
  window.removeEventListener('online', handleOnline);
  window.removeEventListener('offline', handleOffline);
});
</script>

<template>
  <div class="validator-view">
    <main class="main-content">
      <div class="content-wrapper">
        <div class="hero-section">
          <h1 class="headline">Validate Your Package Name</h1>
          <p class="subheadline">
            Check npm naming rules, registry availability, and typosquatting risk instantly.
          </p>
        </div>

        <div class="input-section">
          <AppInput
            v-model="input"
            :loading="isLoading"
            @submit="handleSubmit"
          />
          <p v-if="wasUrlExtracted" class="url-notice">
            Package name extracted from URL
          </p>
        </div>

        <div
          v-if="!isOnline"
          class="offline-banner"
          role="alert"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="1" y1="1" x2="23" y2="23" />
            <path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55" />
            <path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39" />
            <path d="M10.71 5.05A16 16 0 0 1 22.58 9" />
            <path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88" />
            <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
            <line x1="12" y1="20" x2="12.01" y2="20" />
          </svg>
          <span>You're offline — results may be stale</span>
        </div>

        <div
          v-if="showResults"
          :class="['results-region', { 'results-region--visible': resultsVisible }]"
          role="region"
          aria-live="polite"
          aria-label="Validation results"
        >
          <div class="results-stack">
            <SyntaxPanel
              :result="syntaxResult"
              :has-input="hasInput"
            />

            <AvailabilityPanel
              v-if="syntaxResult.valid"
              :status="availability"
              :package-name="processedInput"
              :on-retry="retryRegistry"
            />

            <SimilarPackagesPanel
              v-if="syntaxResult.valid && availability === 'available'"
              :packages="similarPackages"
              :loading="isLoading"
              :error="searchError"
              :on-retry="retrySearch"
            />

            <ValidatorSummary
              v-if="showSummary"
              :syntax="syntaxResult"
              :availability="availability"
              :similar="similarPackages"
            />
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
.validator-view {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: var(--bg-secondary);
}

.main-content {
  flex: 1;
  padding: 48px 24px;
}

.content-wrapper {
  max-width: 640px;
  margin: 0 auto;
}

.hero-section {
  text-align: center;
  margin-bottom: 32px;
}

.headline {
  font-size: 34px;
  font-weight: 700;
  color: var(--label-primary);
  margin: 0 0 12px;
  letter-spacing: -0.5px;
}

.subheadline {
  font-size: 17px;
  color: var(--label-secondary);
  margin: 0;
  line-height: 1.5;
}

.input-section {
  margin-bottom: 24px;
}

.url-notice {
  margin: 8px 0 0;
  font-size: 13px;
  color: var(--blue);
  text-align: center;
}

.offline-banner {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 16px;
  margin-bottom: 24px;
  background-color: rgba(255, 149, 0, 0.1);
  border: 1px solid rgba(255, 149, 0, 0.2);
  border-radius: 12px;
  color: var(--orange);
  font-size: 14px;
}

.results-region {
  opacity: 0;
  transform: translateY(8px);
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.results-region--visible {
  opacity: 1;
  transform: translateY(0);
}

.results-stack {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

@media (max-width: 640px) {
  .main-content {
    padding: 32px 16px;
  }

  .headline {
    font-size: 28px;
  }

  .subheadline {
    font-size: 15px;
  }
}

@media (max-width: 480px) {
  .main-content {
    padding: 24px 16px;
  }

  .headline {
    font-size: 24px;
  }

  .subheadline {
    font-size: 14px;
  }

  .hero-section {
    margin-bottom: 24px;
  }
}
</style>
