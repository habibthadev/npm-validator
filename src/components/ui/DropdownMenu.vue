<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

interface NavItem {
  label: string;
  to: string;
}

const props = defineProps<{
  items: NavItem[];
}>();

const isOpen = ref(false);
const menuRef = ref<HTMLElement | null>(null);

function toggle() {
  isOpen.value = !isOpen.value;
}

function close() {
  isOpen.value = false;
}

function handleClickOutside(e: MouseEvent) {
  if (menuRef.value && !menuRef.value.contains(e.target as Node)) {
    close();
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<template>
  <div ref="menuRef" class="dropdown-menu">
    <button
      type="button"
      class="dropdown-trigger"
      :aria-expanded="isOpen"
      aria-haspopup="true"
      @click="toggle"
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <line x1="3" y1="6" x2="21" y2="6" />
        <line x1="3" y1="12" x2="21" y2="12" />
        <line x1="3" y1="18" x2="21" y2="18" />
      </svg>
    </button>
    <div v-if="isOpen" class="dropdown-content">
      <router-link
        v-for="item in props.items"
        :key="item.to"
        :to="item.to"
        class="dropdown-item"
        @click="close"
      >
        {{ item.label }}
      </router-link>
    </div>
  </div>
</template>

<style scoped>
.dropdown-menu {
  position: relative;
}

.dropdown-trigger {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  padding: 0;
  background: none;
  border: none;
  border-radius: 10px;
  color: var(--label-primary);
  cursor: pointer;
}

.dropdown-trigger:hover {
  background-color: var(--fill-tertiary);
}

.dropdown-content {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  min-width: 180px;
  background-color: var(--bg-primary);
  border: 1px solid var(--separator);
  border-radius: 14px;
  overflow: hidden;
  z-index: 1000;
}

.dropdown-item {
  display: block;
  padding: 14px 20px;
  font-size: 15px;
  font-weight: 500;
  color: var(--label-primary);
  text-decoration: none;
  border-bottom: 1px solid var(--separator);
}

.dropdown-item:last-child {
  border-bottom: none;
}

.dropdown-item:hover {
  background-color: var(--fill-quaternary);
}

.dropdown-item.router-link-active {
  color: var(--blue);
}
</style>
