<script setup lang="ts">
</script>

<template>
  <footer class="app-footer">
    <p class="footer-text">
      Checks against registry.npmjs.org · Similarity via Levenshtein distance
    </p>
    <p class="footer-credit">
      Built by <a href="https://habibthadev.tech" target="_blank" rel="noopener noreferrer">Habib</a>
    </p>
  </footer>
</template>

<style scoped>
.app-footer {
  padding: 32px 24px;
  text-align: center;
}

.footer-text {
  margin: 0 0 8px;
  font-size: 12px;
  color: var(--label-tertiary);
}

.footer-credit {
  margin: 0;
  font-size: 12px;
  color: var(--label-tertiary);
}

.footer-credit a {
  color: var(--blue);
  text-decoration: none;
}

.footer-credit a:hover {
  text-decoration: underline;
}
</style>
