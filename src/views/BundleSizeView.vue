<script setup lang="ts">
import { ref, computed } from 'vue';
import { useBundleAnalyzer } from '@/composables/useBundleAnalyzer';
import BundleInput from '@/components/bundle/BundleInput.vue';
import BundleResult from '@/components/bundle/BundleResult.vue';
import PackageInfo from '@/components/bundle/PackageInfo.vue';
import SkeletonBlock from '@/components/ui/SkeletonBlock.vue';

const packageName = ref('');
const namedImport = ref('');
const version = ref('');

const { isAnalyzing, error, metadata, stats, fullBundle, namedBundle, analyze } = useBundleAnalyzer();

function handleAnalyze() {
  analyze(packageName.value, namedImport.value || undefined, version.value || undefined);
}

const calculateSavings = computed(() => {
  if (!fullBundle.value || !namedBundle.value) return 0;
  const fullSize = fullBundle.value.brotliSize;
  const namedSize = namedBundle.value.brotliSize;
  return Math.round(((fullSize - namedSize) / fullSize) * 100);
});
</script>

<template>
  <div class="bundle-view">
    <div class="view-container">
      <div class="view-header">
        <h1 class="view-title">Bundle Size Analyzer</h1>
        <p class="view-subtitle">
          Analyze npm package bundle sizes with in-browser esbuild. Get minified, gzip, and brotli sizes instantly. Compare full imports with tree-shaken named exports.
        </p>
      </div>

      <div class="input-section">
        <BundleInput
          v-model="packageName"
          v-model:named-import="namedImport"
          v-model:version="version"
          :disabled="isAnalyzing"
          @analyze="handleAnalyze"
        />
      </div>

      <div v-if="error" class="error-state">
        <div class="error-icon">
          <svg width="48" height="48" viewBox="0 0 256 256" fill="currentColor">
            <path d="M128 24a104 104 0 1 0 104 104A104.11 104.11 0 0 0 128 24Zm0 192a88 88 0 1 1 88-88 88.1 88.1 0 0 1-88 88Zm-8-80V80a8 8 0 0 1 16 0v56a8 8 0 0 1-16 0Zm20 36a12 12 0 1 1-12-12 12 12 0 0 1 12 12Z"/>
          </svg>
        </div>
        <h3 class="error-title">Analysis Failed</h3>
        <p class="error-message">{{ error }}</p>
        <button type="button" class="retry-button" @click="handleAnalyze">
          <svg width="16" height="16" viewBox="0 0 256 256" fill="currentColor">
            <path d="M224 128a96 96 0 0 1-160.2 71.8 8 8 0 1 1 10.7-11.9 80 80 0 1 0-1.1-114.3L56 91V40a8 8 0 0 0-16 0v72a8 8 0 0 0 8 8h72a8 8 0 0 0 0-16H75.3l17.5-17.5A96 96 0 0 1 224 128Z"/>
          </svg>
          <span>Retry Analysis</span>
        </button>
      </div>

      <div v-if="isAnalyzing" class="loading-section">
        <div class="skeleton-package">
          <SkeletonBlock height="100px" />
        </div>
        <div class="skeleton-result">
          <SkeletonBlock height="180px" />
        </div>
      </div>

      <div v-if="!isAnalyzing && fullBundle" class="results-section">
        <PackageInfo
          v-if="metadata"
          :metadata="metadata"
          :stats="stats"
        />

        <BundleResult
          :result="fullBundle"
          label="Full Import"
        />

        <div v-if="namedBundle" class="comparison-section">
          <div class="comparison-header">
            <div class="comparison-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M7 8l-4 4 4 4M17 8l4 4-4 4M14 4l-4 16"/>
              </svg>
            </div>
            <div>
              <h3 class="comparison-title">Tree-Shaking Savings</h3>
              <p class="comparison-subtitle">Named import reduces bundle size by {{ calculateSavings }}%</p>
            </div>
          </div>

          <BundleResult
            :result="namedBundle"
            label="Named Import"
          />
        </div>

        <div v-if="metadata && !metadata.hasESM" class="info-card">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
          </svg>
          <div>
            <div class="info-title">No ESM Build Detected</div>
            <div class="info-text">This package does not provide an ES modules build, which may limit tree-shaking capabilities.</div>
          </div>
        </div>
      </div>

      <div v-if="!isAnalyzing && !fullBundle && !error" class="empty-state">
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none" stroke="var(--label-quaternary)" stroke-width="2">
          <rect x="8" y="16" width="48" height="40" rx="4"/>
          <path d="M8 24h48M20 16v-4M44 16v-4"/>
          <circle cx="32" cy="36" r="8"/>
          <path d="M28 36h8M32 32v8"/>
        </svg>
        <div class="empty-title">Enter a package name to begin</div>
        <div class="empty-text">Analyze npm packages to see their real-world bundle impact with gzip and brotli compression.</div>
      </div>

      <div class="features-grid">
        <div class="feature-card">
          <div class="feature-icon">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M16 4v24M8 12l8-8 8 8M8 20l8 8 8-8"/>
            </svg>
          </div>
          <h3 class="feature-title">In-Browser Bundling</h3>
          <p class="feature-text">esbuild WASM runs entirely in your browser. No server needed, instant results.</p>
        </div>

        <div class="feature-card">
          <div class="feature-icon">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="16" cy="16" r="12"/>
              <path d="M16 8v8l4 4"/>
            </svg>
          </div>
          <h3 class="feature-title">Brotli Compression</h3>
          <p class="feature-text">See the actual size users download with modern brotli compression, not just gzip.</p>
        </div>

        <div class="feature-card">
          <div class="feature-icon">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M4 8h24M4 16h16M4 24h20"/>
            </svg>
          </div>
          <h3 class="feature-title">Tree-Shaking Analysis</h3>
          <p class="feature-text">Compare full imports vs named exports to see how much tree-shaking saves.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.bundle-view {
  min-height: 100vh;
  padding: 80px 0 120px;
  background-color: var(--bg-secondary);
}

.view-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 20px;
}

.view-header {
  text-align: center;
  margin-bottom: 56px;
}

.view-title {
  font-size: 48px;
  font-weight: 700;
  color: var(--label-primary);
  margin: 0 0 16px 0;
  letter-spacing: -0.03em;
}

.view-subtitle {
  font-size: 18px;
  color: var(--label-secondary);
  max-width: 700px;
  margin: 0 auto;
  line-height: 1.6;
}

.input-section {
  margin-bottom: 40px;
  padding: 32px;
  background-color: var(--bg-primary);
  border: 1px solid var(--separator);
  border-radius: 20px;
}

.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 64px 32px;
  margin-bottom: 40px;
  background-color: var(--bg-primary);
  border: 1px solid var(--separator);
  border-radius: 20px;
}

.error-icon {
  color: var(--red);
  margin-bottom: 20px;
}

.error-title {
  font-size: 20px;
  font-weight: 600;
  color: var(--label-primary);
  margin: 0 0 12px 0;
}

.error-message {
  font-size: 15px;
  color: var(--label-secondary);
  max-width: 400px;
  margin: 0 0 32px 0;
  line-height: 1.5;
}

.retry-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 48px;
  padding: 0 24px;
  background-color: var(--blue);
  border: none;
  border-radius: 12px;
  color: #ffffff;
  font-family: 'SF Pro Text', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.15s ease;
}

.retry-button:hover {
  opacity: 0.9;
}

.retry-button:active {
  opacity: 0.8;
}

.loading-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 40px;
}

.skeleton-package,
.skeleton-result {
  width: 100%;
}

.results-section {
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-bottom: 56px;
}

.comparison-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.comparison-header {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px 24px;
  background-color: var(--bg-primary);
  border: 1px solid var(--separator);
  border-radius: 16px;
}

.comparison-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 122, 255, 0.12);
  border-radius: 12px;
  color: var(--blue);
}

.comparison-title {
  font-size: 17px;
  font-weight: 600;
  color: var(--label-primary);
  margin: 0 0 4px 0;
}

.comparison-subtitle {
  font-size: 14px;
  color: var(--label-secondary);
  margin: 0;
}

.info-card {
  display: flex;
  gap: 16px;
  padding: 20px 24px;
  background-color: rgba(255, 149, 0, 0.1);
  border: 1px solid rgba(255, 149, 0, 0.2);
  border-radius: 16px;
}

.info-card svg {
  flex-shrink: 0;
  color: var(--orange);
}

.info-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--label-primary);
  margin-bottom: 4px;
}

.info-text {
  font-size: 14px;
  color: var(--label-secondary);
  line-height: 1.5;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 80px 20px;
  text-align: center;
}

.empty-title {
  font-size: 20px;
  font-weight: 600;
  color: var(--label-primary);
}

.empty-text {
  font-size: 15px;
  color: var(--label-secondary);
  max-width: 480px;
  line-height: 1.6;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
  margin-top: 56px;
}

.feature-card {
  padding: 32px;
  background-color: var(--bg-primary);
  border: 1px solid var(--separator);
  border-radius: 20px;
}

.feature-icon {
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--fill-quaternary);
  border-radius: 14px;
  color: var(--blue);
  margin-bottom: 20px;
}

.feature-title {
  font-size: 17px;
  font-weight: 600;
  color: var(--label-primary);
  margin: 0 0 8px 0;
}

.feature-text {
  font-size: 15px;
  color: var(--label-secondary);
  line-height: 1.5;
  margin: 0;
}

@media (max-width: 768px) {
  .bundle-view {
    padding: 60px 0 80px;
  }

  .view-header {
    margin-bottom: 40px;
  }

  .view-title {
    font-size: 36px;
  }

  .view-subtitle {
    font-size: 16px;
  }

  .input-section {
    padding: 24px;
  }

  .features-grid {
    grid-template-columns: 1fr;
  }

  .feature-card {
    padding: 24px;
  }
}
</style>
