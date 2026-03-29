<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue';

const copied = ref(false);

const steps = [
  {
    title: 'Create Distance Matrix',
    description: 'Initialize a matrix of size (m+1) x (n+1) where m and n are the lengths of the two strings. The first row and column represent the cost of inserting characters from an empty string.'
  },
  {
    title: 'Fill the Matrix',
    description: 'For each cell, calculate the minimum cost among: insertion (cell above + 1), deletion (cell to the left + 1), or substitution (diagonal cell + 0 if characters match, +1 if they differ).'
  },
  {
    title: 'Read the Distance',
    description: 'The value in the bottom-right cell represents the minimum number of single-character edits required to transform one string into the other.'
  },
  {
    title: 'Calculate Similarity',
    description: 'Convert the distance to a similarity percentage using the formula: (1 - distance / maxLength) × 100. Higher percentages indicate more similar strings.'
  }
];

const example = {
  source: 'lodash',
  target: 'lodas',
  distance: 1,
  similarity: 83
};

const matrixData = computed(() => {
  const s1 = example.source;
  const s2 = example.target;
  const m = s1.length;
  const n = s2.length;
  const matrix: number[][] = [];
  
  for (let i = 0; i <= m; i++) {
    matrix[i] = [];
    for (let j = 0; j <= n; j++) {
      if (i === 0) {
        matrix[i]![j] = j;
      } else if (j === 0) {
        matrix[i]![j] = i;
      } else {
        const cost = s1[i - 1] === s2[j - 1] ? 0 : 1;
        matrix[i]![j] = Math.min(
          matrix[i - 1]![j]! + 1,
          matrix[i]![j - 1]! + 1,
          matrix[i - 1]![j - 1]! + cost
        );
      }
    }
  }
  return matrix;
});

const codeContent = `function levenshteinDistance(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  const dp: number[][] = [];

  for (let i = 0; i <= m; i++) {
    dp[i] = [];
    for (let j = 0; j <= n; j++) {
      if (i === 0) dp[i][j] = j;
      else if (j === 0) dp[i][j] = i;
      else {
        const cost = a[i - 1] === b[j - 1] ? 0 : 1;
        dp[i][j] = Math.min(
          dp[i - 1][j] + 1,
          dp[i][j - 1] + 1,
          dp[i - 1][j - 1] + cost
        );
      }
    }
  }
  return dp[m][n];
}`;

async function copyCode() {
  await navigator.clipboard.writeText(codeContent);
  copied.value = true;
  setTimeout(() => {
    copied.value = false;
  }, 2000);
}

function handleScroll() {
  const elements = document.querySelectorAll('.animate-in');
  
  elements.forEach((el) => {
    const rect = el.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    
    if (rect.top < windowHeight * 0.9) {
      el.classList.add('visible');
    }
  });
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
  handleScroll();
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<template>
  <main class="levenshtein-page">
    <div class="container">
      <header class="page-header">
        <h1 class="page-title">Levenshtein Distance Algorithm</h1>
        <p class="page-subtitle">Understanding the string similarity metric used to detect typosquatting in npm package names</p>
      </header>

      <section class="content-section animate-in">
        <h2 class="section-title">What is Levenshtein Distance?</h2>
        <p class="section-text">
          Levenshtein distance, also known as edit distance, measures the minimum number of single-character edits required to transform one string into another. The allowed edit operations are insertion, deletion, and substitution of a single character.
        </p>
        <p class="section-text">
          This metric is particularly useful for detecting typosquatting attacks in package registries, where malicious actors publish packages with names similar to popular ones, hoping developers will accidentally install them.
        </p>
      </section>

      <section class="content-section animate-in">
        <h2 class="section-title">How It Works</h2>
        <div class="steps-grid">
          <div v-for="(step, index) in steps" :key="index" class="step-card animate-in" :style="{ '--delay': `${index * 0.1}s` }">
            <div class="step-number">{{ index + 1 }}</div>
            <div class="step-content">
              <h3 class="step-title">{{ step.title }}</h3>
              <p class="step-description">{{ step.description }}</p>
            </div>
          </div>
        </div>
      </section>

      <section class="content-section animate-in">
        <h2 class="section-title">Example Calculation</h2>
        <p class="section-text">
          Comparing <code class="inline-code">{{ example.source }}</code> with <code class="inline-code">{{ example.target }}</code>:
        </p>
        
        <div class="matrix-container">
          <table class="distance-matrix">
            <thead>
              <tr>
                <th></th>
                <th></th>
                <th v-for="(char, i) in example.target" :key="i">{{ char }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, i) in matrixData" :key="i">
                <th>{{ i === 0 ? '' : example.source[i - 1] }}</th>
                <td 
                  v-for="(cell, j) in row" 
                  :key="j"
                  :class="{ 
                    'cell-result': i === matrixData.length - 1 && j === row.length - 1,
                    'cell-path': (i === 0 || j === 0)
                  }"
                >
                  {{ cell }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="result-cards">
          <div class="result-card">
            <span class="result-label">Edit Distance</span>
            <span class="result-value">{{ example.distance }}</span>
          </div>
          <div class="result-card">
            <span class="result-label">Similarity Score</span>
            <span class="result-value result-value--highlight">{{ example.similarity }}%</span>
          </div>
        </div>
      </section>

      <section class="content-section animate-in">
        <h2 class="section-title">Risk Level Classification</h2>
        <p class="section-text">
          Based on the similarity score, we classify the typosquatting risk into three levels:
        </p>
        <div class="risk-levels">
          <div class="risk-item risk-item--high animate-in" style="--delay: 0s">
            <div class="risk-indicator"></div>
            <div class="risk-content">
              <span class="risk-title">High Risk</span>
              <span class="risk-range">80% or higher similarity</span>
            </div>
          </div>
          <div class="risk-item risk-item--medium animate-in" style="--delay: 0.1s">
            <div class="risk-indicator"></div>
            <div class="risk-content">
              <span class="risk-title">Medium Risk</span>
              <span class="risk-range">60% to 79% similarity</span>
            </div>
          </div>
          <div class="risk-item risk-item--low animate-in" style="--delay: 0.2s">
            <div class="risk-indicator"></div>
            <div class="risk-content">
              <span class="risk-title">Low Risk</span>
              <span class="risk-range">Below 60% similarity</span>
            </div>
          </div>
        </div>
      </section>

      <section class="content-section animate-in">
        <h2 class="section-title">Implementation</h2>
        <p class="section-text">
          The algorithm uses dynamic programming to efficiently compute the distance in O(m×n) time complexity, where m and n are the lengths of the two strings. Space complexity can be optimized to O(min(m,n)) by only keeping track of two rows at a time.
        </p>
        <div class="code-block">
          <div class="code-header">
            <div class="code-filename">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
                <polyline points="14 2 14 8 20 8"/>
              </svg>
              <span>levenshtein.ts</span>
            </div>
            <button type="button" class="code-copy" @click="copyCode">
              <svg v-if="!copied" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
              </svg>
              <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              <span>{{ copied ? 'Copied' : 'Copy' }}</span>
            </button>
          </div>
          <pre><code><span class="token keyword">function</span> <span class="token function">levenshteinDistance</span>(<span class="token parameter">a</span>: <span class="token type">string</span>, <span class="token parameter">b</span>: <span class="token type">string</span>): <span class="token type">number</span> {
  <span class="token keyword">const</span> m = a.<span class="token property">length</span>;
  <span class="token keyword">const</span> n = b.<span class="token property">length</span>;
  <span class="token keyword">const</span> dp: <span class="token type">number</span>[][] = [];

  <span class="token keyword">for</span> (<span class="token keyword">let</span> i = <span class="token number">0</span>; i &lt;= m; i++) {
    dp[i] = [];
    <span class="token keyword">for</span> (<span class="token keyword">let</span> j = <span class="token number">0</span>; j &lt;= n; j++) {
      <span class="token keyword">if</span> (i === <span class="token number">0</span>) dp[i][j] = j;
      <span class="token keyword">else if</span> (j === <span class="token number">0</span>) dp[i][j] = i;
      <span class="token keyword">else</span> {
        <span class="token keyword">const</span> cost = a[i - <span class="token number">1</span>] === b[j - <span class="token number">1</span>] ? <span class="token number">0</span> : <span class="token number">1</span>;
        dp[i][j] = <span class="token builtin">Math</span>.<span class="token function">min</span>(
          dp[i - <span class="token number">1</span>][j] + <span class="token number">1</span>,
          dp[i][j - <span class="token number">1</span>] + <span class="token number">1</span>,
          dp[i - <span class="token number">1</span>][j - <span class="token number">1</span>] + cost
        );
      }
    }
  }
  <span class="token keyword">return</span> dp[m][n];
}</code></pre>
        </div>
      </section>

      <section class="cta-section animate-in">
        <h2 class="cta-title">Ready to validate your package name?</h2>
        <p class="cta-subtitle">Check availability and detect potential typosquatting risks.</p>
        <router-link to="/validator" class="cta-button">
          Try the Validator
        </router-link>
      </section>
    </div>
  </main>
</template>

<style scoped>
.levenshtein-page {
  min-height: 100vh;
  padding: 40px 24px 80px;
}

.container {
  max-width: 800px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 64px;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 15px;
  font-weight: 500;
  color: var(--blue);
  text-decoration: none;
  margin-bottom: 24px;
}

.page-title {
  font-size: 40px;
  font-weight: 700;
  color: var(--label-primary);
  margin: 0 0 16px 0;
  letter-spacing: -0.02em;
}

.page-subtitle {
  font-size: 18px;
  color: var(--label-secondary);
  margin: 0;
  line-height: 1.6;
}

.content-section {
  margin-bottom: 56px;
}

.section-title {
  font-size: 24px;
  font-weight: 600;
  color: var(--label-primary);
  margin: 0 0 20px 0;
  letter-spacing: -0.01em;
}

.section-text {
  font-size: 16px;
  color: var(--label-secondary);
  line-height: 1.7;
  margin: 0 0 16px 0;
}

.inline-code {
  font-family: 'SF Mono', 'Menlo', monospace;
  font-size: 14px;
  background-color: var(--fill-tertiary);
  padding: 3px 8px;
  border-radius: 6px;
  color: var(--label-primary);
}

.steps-grid {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.step-card {
  display: flex;
  gap: 20px;
  padding: 24px;
  background-color: var(--bg-primary);
  border-radius: 16px;
  border: 1px solid var(--separator);
}

.step-number {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--blue);
  color: #ffffff;
  font-size: 15px;
  font-weight: 600;
  border-radius: 10px;
  flex-shrink: 0;
}

.step-content {
  flex: 1;
}

.step-title {
  font-size: 17px;
  font-weight: 600;
  color: var(--label-primary);
  margin: 0 0 8px 0;
}

.step-description {
  font-size: 15px;
  color: var(--label-secondary);
  margin: 0;
  line-height: 1.6;
}

.matrix-container {
  overflow-x: auto;
  margin: 24px 0;
  padding: 24px;
  background-color: var(--bg-primary);
  border-radius: 16px;
  border: 1px solid var(--separator);
}

.distance-matrix {
  border-collapse: collapse;
  font-family: 'SF Mono', 'Menlo', monospace;
  font-size: 14px;
  margin: 0 auto;
}

.distance-matrix th,
.distance-matrix td {
  width: 40px;
  height: 40px;
  text-align: center;
  border: 1px solid var(--separator);
}

.distance-matrix th {
  font-weight: 600;
  color: var(--label-primary);
  background-color: var(--fill-quaternary);
}

.distance-matrix td {
  color: var(--label-secondary);
}

.cell-result {
  background-color: var(--blue);
  color: #ffffff !important;
  font-weight: 600;
}

.cell-path {
  background-color: var(--fill-tertiary);
}

.result-cards {
  display: flex;
  gap: 16px;
  margin-top: 24px;
}

.result-card {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 20px;
  background-color: var(--bg-primary);
  border-radius: 12px;
  border: 1px solid var(--separator);
}

.result-label {
  font-size: 13px;
  font-weight: 500;
  color: var(--label-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.02em;
}

.result-value {
  font-size: 32px;
  font-weight: 700;
  color: var(--label-primary);
}

.result-value--highlight {
  color: var(--blue);
}

.risk-levels {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 20px;
}

.risk-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 20px;
  background-color: var(--bg-primary);
  border-radius: 12px;
  border: 1px solid var(--separator);
}

.risk-indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.risk-item--high .risk-indicator {
  background-color: var(--red);
}

.risk-item--medium .risk-indicator {
  background-color: var(--orange);
}

.risk-item--low .risk-indicator {
  background-color: var(--green);
}

.risk-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.risk-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--label-primary);
}

.risk-range {
  font-size: 13px;
  color: var(--label-secondary);
}

.code-block {
  margin: 20px 0 0 0;
  background-color: #ffffff;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid var(--separator);
}

.code-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background-color: var(--fill-quaternary);
  border-bottom: 1px solid var(--separator);
}

.code-filename {
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: 'JetBrains Mono', 'SF Mono', 'Menlo', monospace;
  font-size: 13px;
  font-weight: 500;
  color: var(--label-secondary);
}

.code-filename svg {
  color: var(--label-tertiary);
}

.code-copy {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background-color: transparent;
  border: 1px solid var(--separator);
  border-radius: 6px;
  font-family: 'SF Pro Text', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 12px;
  font-weight: 500;
  color: var(--label-secondary);
  cursor: pointer;
  transition: background-color 0.15s ease, border-color 0.15s ease;
}

.code-copy:hover {
  background-color: var(--fill-tertiary);
  border-color: var(--separator-opaque);
}

.code-copy:active {
  background-color: var(--fill-secondary);
}

.code-copy svg {
  width: 14px;
  height: 14px;
}

.code-block pre {
  margin: 0;
  padding: 24px;
  overflow-x: auto;
}

.code-block code {
  font-family: 'JetBrains Mono', 'SF Mono', 'Menlo', monospace;
  font-size: 13px;
  line-height: 1.7;
  color: #393a34;
  white-space: pre;
}

.code-block .token.keyword {
  color: #1e754f;
}

.code-block .token.function {
  color: #59873a;
}

.code-block .token.parameter {
  color: #393a34;
}

.code-block .token.type {
  color: #2e8f82;
}

.code-block .token.property {
  color: #b07d48;
}

.code-block .token.number {
  color: #2f798a;
}

.code-block .token.builtin {
  color: #ab5959;
}

.cta-section {
  text-align: center;
  padding: 56px 32px;
  background-color: var(--bg-primary);
  border-radius: 24px;
  border: 1px solid var(--separator);
}

.cta-title {
  font-size: 28px;
  font-weight: 700;
  color: var(--label-primary);
  margin: 0 0 12px 0;
  letter-spacing: -0.02em;
}

.cta-subtitle {
  font-size: 16px;
  color: var(--label-secondary);
  margin: 0 0 28px 0;
}

.cta-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 16px 32px;
  background-color: var(--blue);
  color: #ffffff;
  font-size: 16px;
  font-weight: 600;
  text-decoration: none;
  border-radius: 12px;
}

@media (max-width: 640px) {
  .levenshtein-page {
    padding: 24px 16px 60px;
  }

  .page-title {
    font-size: 32px;
  }

  .page-subtitle {
    font-size: 16px;
  }

  .section-title {
    font-size: 20px;
  }

  .step-card {
    flex-direction: column;
    gap: 16px;
    padding: 20px;
  }

  .result-cards {
    flex-direction: column;
  }

  .cta-section {
    padding: 40px 24px;
  }

  .cta-title {
    font-size: 24px;
  }
}

.animate-in {
  opacity: 0;
  transform: translateY(20px);
}

.animate-in.visible {
  opacity: 1;
  transform: translateY(0);
  transition: opacity 0.5s ease, transform 0.5s ease;
  transition-delay: var(--delay, 0s);
}
</style>
