<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import AccordionItem from '@/components/ui/AccordionItem.vue';

const router = useRouter();

function navigateToValidator() {
  router.push('/validator');
}

const faqs = [
  {
    question: 'What are npm package naming rules?',
    answer: 'NPM package names must be lowercase, can contain hyphens and underscores, cannot start with dots or underscores, must be 214 characters or less, cannot be URL-unsafe, and cannot use reserved keywords like node_modules or favicon.ico. Scoped packages follow the format @scope/name.'
  },
  {
    question: 'What is typosquatting?',
    answer: 'Typosquatting is when malicious actors publish packages with names similar to popular packages, hoping developers will accidentally install the wrong package. This tool helps you avoid unintentionally creating a package name too similar to existing ones.'
  },
  {
    question: 'How is similarity score calculated?',
    answer: 'The similarity score uses the Levenshtein distance algorithm, which measures the minimum number of single-character edits needed to change one word into another. Scores above 80 indicate high risk, 60-79 medium risk, and 40-59 low risk.'
  },
  {
    question: 'Can I check scoped packages?',
    answer: 'Yes, this tool fully supports scoped packages. Enter your package name in the format @scope/package-name. The tool will validate the scope format and check availability in the npm registry.'
  },
  {
    question: 'Is my package name data stored?',
    answer: 'Validation history is stored locally in your browser using localStorage for convenience. No data is sent to external servers except official npm registry API calls. Your searches remain private.'
  },
  {
    question: 'Does this work offline?',
    answer: 'Syntax validation works offline since it runs entirely in your browser. Registry availability checks and similarity searches require an internet connection to query the npm registry API.'
  }
];

function handleScroll() {
  const elements = document.querySelectorAll('.feature-card, .step-item');
  
  elements.forEach((el) => {
    const rect = el.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    
    if (rect.top < windowHeight * 0.85) {
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
  <div class="home-view">
    <main class="main-content">
      <section class="hero-section">
        <div class="hero-content">
          <p class="hero-eyebrow">VALIDATE WITH CONFIDENCE</p>
          <h1 class="hero-title">Check your npm package name before you publish</h1>
          <p class="hero-subtitle">
            Verify naming rules, check availability, and detect similar packages — all in one place.
          </p>
          <button class="cta-button" @click="navigateToValidator">
            Get Started
          </button>
        </div>
      </section>

      <section class="features-section">
        <h2 class="section-title">Why Validate Your Package Name?</h2>
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon" style="background-color: rgba(52, 199, 89, 0.15);">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="9 11 12 14 22 4" />
                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
              </svg>
            </div>
            <h3 class="feature-title">NPM Naming Rules</h3>
            <p class="feature-description">Instantly verify your package name meets all npm registry requirements including length limits, character restrictions, and reserved keywords.</p>
          </div>

          <div class="feature-card">
            <div class="feature-icon" style="background-color: rgba(0, 122, 255, 0.15);">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </div>
            <h3 class="feature-title">Registry Availability</h3>
            <p class="feature-description">Check npm registry in real-time to see if your desired package name is available or already taken by another developer.</p>
          </div>

          <div class="feature-card">
            <div class="feature-icon" style="background-color: rgba(255, 149, 0, 0.15);">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </div>
            <h3 class="feature-title">Typosquatting Detection</h3>
            <p class="feature-description">Find packages with similar names using Levenshtein distance algorithm to avoid accidental typosquatting and protect users.</p>
          </div>

          <div class="feature-card">
            <div class="feature-icon" style="background-color: rgba(175, 82, 222, 0.15);">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
              </svg>
            </div>
            <h3 class="feature-title">Risk Scoring</h3>
            <p class="feature-description">Get comprehensive similarity scores for existing packages to understand potential confusion risks before publishing.</p>
          </div>

          <div class="feature-card">
            <div class="feature-icon" style="background-color: rgba(255, 59, 48, 0.15);">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <h3 class="feature-title">Best Practices</h3>
            <p class="feature-description">Receive warnings about potential issues like core module conflicts, single character names, and problematic patterns.</p>
          </div>

          <div class="feature-card">
            <div class="feature-icon" style="background-color: rgba(90, 200, 250, 0.15);">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
              </svg>
            </div>
            <h3 class="feature-title">Instant Results</h3>
            <p class="feature-description">No installation required. Fast client-side validation with real-time npm registry checks and similarity analysis.</p>
          </div>
        </div>
      </section>

      <section class="how-it-works-section">
        <h2 class="section-title">How It Works</h2>
        <div class="steps-list">
          <div class="step-item">
            <div class="step-number">1</div>
            <div class="step-content">
              <h3 class="step-title">Enter Package Name</h3>
              <p class="step-description">Type your desired npm package name or paste a full npm URL. The tool automatically extracts the package name from URLs.</p>
            </div>
          </div>

          <div class="step-item">
            <div class="step-number">2</div>
            <div class="step-content">
              <h3 class="step-title">Syntax Validation</h3>
              <p class="step-description">Instantly checks against npm naming rules: no uppercase letters, no URL-unsafe characters, length limits, and blacklisted keywords.</p>
            </div>
          </div>

          <div class="step-item">
            <div class="step-number">3</div>
            <div class="step-content">
              <h3 class="step-title">Registry Check</h3>
              <p class="step-description">Queries the official npm registry API to verify if the package name is available or already published by another developer.</p>
            </div>
          </div>

          <div class="step-item">
            <div class="step-number">4</div>
            <div class="step-content">
              <h3 class="step-title">Similarity Analysis</h3>
              <p class="step-description">Searches for similar package names using Levenshtein distance algorithm to detect potential typosquatting risks and naming conflicts.</p>
            </div>
          </div>

          <div class="step-item">
            <div class="step-number">5</div>
            <div class="step-content">
              <h3 class="step-title">Get Results</h3>
              <p class="step-description">Receive a comprehensive validation report with errors, warnings, availability status, and similar packages with risk levels.</p>
            </div>
          </div>
        </div>
      </section>

      <section class="faq-section">
        <h2 class="section-title">Frequently Asked Questions</h2>
        <div class="faq-list">
          <AccordionItem
            v-for="(faq, index) in faqs"
            :key="index"
            :question="faq.question"
            :answer="faq.answer"
          />
        </div>
      </section>

      <section class="cta-section">
        <h2 class="cta-title">Ready to Validate Your Package Name?</h2>
        <p class="cta-description">Start checking naming rules, registry availability, and typosquatting risk in seconds.</p>
        <button class="cta-button" @click="navigateToValidator">
          Get Started
        </button>
      </section>
    </main>
  </div>
</template>

<style scoped>
.home-view {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: var(--bg-secondary);
}

.main-content {
  flex: 1;
}

.hero-section {
  background-color: var(--bg-primary);
  padding: 140px 32px 120px;
  text-align: center;
  margin-bottom: 0;
  border-bottom: 1px solid var(--separator);
}

.hero-content {
  max-width: 680px;
  margin: 0 auto;
}

.hero-eyebrow {
  font-size: 15px;
  font-weight: 600;
  color: var(--blue);
  margin: 0 0 20px;
  letter-spacing: 0.08em;
}

.hero-title {
  font-size: 52px;
  font-weight: 700;
  color: var(--label-primary);
  margin: 0 0 20px;
  letter-spacing: -0.015em;
  line-height: 1.08;
}

.hero-subtitle {
  font-size: 21px;
  font-weight: 400;
  color: var(--label-secondary);
  margin: 0 0 40px;
  line-height: 1.48;
  max-width: 580px;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 40px;
}

.cta-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 15px 32px;
  font-size: 17px;
  font-weight: 500;
  color: #ffffff;
  background-color: var(--blue);
  border: none;
  border-radius: 12px;
  min-width: 180px;
  transition: opacity 0.2s;
}

.cta-button:hover {
  opacity: 0.88;
}

.features-section,
.how-it-works-section,
.faq-section,
.cta-section {
  max-width: 1200px;
  margin: 0 auto;
  padding: 80px 32px;
}

.section-title {
  font-size: 32px;
  font-weight: 700;
  color: var(--label-primary);
  text-align: center;
  margin: 0 0 40px;
  letter-spacing: -0.5px;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
}

.feature-card {
  background-color: var(--bg-primary);
  border-radius: 16px;
  padding: 28px;
  border: 1px solid var(--separator);
  transition: transform 0.3s ease, border-color 0.3s ease, opacity 0.6s ease;
  opacity: 0;
  transform: translateY(20px);
}

.feature-card.visible {
  opacity: 1;
  transform: translateY(0);
}

.feature-card:nth-child(1).visible {
  transition-delay: 0.1s;
}

.feature-card:nth-child(2).visible {
  transition-delay: 0.15s;
}

.feature-card:nth-child(3).visible {
  transition-delay: 0.2s;
}

.feature-card:nth-child(4).visible {
  transition-delay: 0.25s;
}

.feature-card:nth-child(5).visible {
  transition-delay: 0.3s;
}

.feature-card:nth-child(6).visible {
  transition-delay: 0.35s;
}

.feature-card:hover {
  transform: translateY(-4px);
  border-color: var(--blue);
}

.feature-icon {
  width: 52px;
  height: 52px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
}

.feature-icon svg {
  color: var(--label-primary);
}

.feature-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--label-primary);
  margin: 0 0 8px;
}

.feature-description {
  font-size: 15px;
  color: var(--label-secondary);
  margin: 0;
  line-height: 1.6;
}

.steps-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
  max-width: 700px;
  margin: 0 auto;
}

.step-item {
  display: flex;
  gap: 20px;
  background-color: var(--bg-primary);
  border-radius: 16px;
  padding: 24px;
  border: 1px solid var(--separator);
  opacity: 0;
  transform: translateX(-20px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}

.step-item.visible {
  opacity: 1;
  transform: translateX(0);
}

.step-item:nth-child(1).visible {
  transition-delay: 0.1s;
}

.step-item:nth-child(2).visible {
  transition-delay: 0.2s;
}

.step-item:nth-child(3).visible {
  transition-delay: 0.3s;
}

.step-item:nth-child(4).visible {
  transition-delay: 0.4s;
}

.step-item:nth-child(5).visible {
  transition-delay: 0.5s;
}

.step-number {
  flex-shrink: 0;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background-color: var(--blue);
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: 700;
}

.step-content {
  flex: 1;
}

.step-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--label-primary);
  margin: 0 0 8px;
}

.step-description {
  font-size: 15px;
  color: var(--label-secondary);
  margin: 0;
  line-height: 1.6;
}

.faq-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-width: 800px;
  margin: 0 auto;
}

.cta-section {
  text-align: center;
  padding: 60px 32px;
  background-color: var(--bg-primary);
  border-radius: 24px;
  border: 1px solid var(--separator);
  max-width: 640px;
  margin: 0 auto;
}

.cta-title {
  font-size: 28px;
  font-weight: 600;
  color: var(--label-primary);
  margin: 0 0 12px;
  letter-spacing: -0.4px;
}

.cta-description {
  font-size: 17px;
  font-weight: 400;
  color: var(--label-secondary);
  margin: 0 0 32px;
  line-height: 1.5;
}

@media (max-width: 768px) {
  .hero-section {
    padding: 100px 24px 80px;
  }

  .hero-eyebrow {
    font-size: 13px;
    margin-bottom: 16px;
  }

  .hero-title {
    font-size: 40px;
    letter-spacing: -0.012em;
  }

  .hero-subtitle {
    font-size: 19px;
  }

  .cta-button {
    padding: 13px 28px;
  }

  .features-section,
  .how-it-works-section,
  .faq-section,
  .cta-section {
    padding: 64px 24px;
  }

  .section-title {
    font-size: 28px;
  }

  .features-grid {
    grid-template-columns: 1fr;
  }

  .features-section,
  .how-it-works-section,
  .faq-section,
  .cta-section {
    margin-bottom: 60px;
  }
}

@media (max-width: 480px) {
  .hero-section {
    padding: 80px 20px 64px;
  }

  .hero-eyebrow {
    font-size: 12px;
    margin-bottom: 16px;
  }

  .hero-title {
    font-size: 32px;
    letter-spacing: -0.01em;
    line-height: 1.12;
    margin-bottom: 16px;
  }

  .hero-subtitle {
    font-size: 17px;
    margin-bottom: 32px;
  }

  .cta-button {
    padding: 12px 24px;
    font-size: 16px;
    min-width: 160px;
  }

  .section-title {
    font-size: 24px;
    margin-bottom: 32px;
  }

  .feature-card,
  .step-item,
  .faq-item {
    padding: 20px;
  }

  .cta-section {
    padding: 40px 24px;
  }

  .cta-title {
    font-size: 24px;
  }

  .features-section,
  .how-it-works-section,
  .faq-section,
  .cta-section {
    padding: 48px 20px;
  }
}
</style>
