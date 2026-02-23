// src/stores/themeStore.js
import { defineStore } from 'pinia';
import { ref, computed, onMounted, onUnmounted } from 'vue';

export const useThemeStore = defineStore('theme', () => {
  // 主题状态
  const theme = ref(localStorage.getItem('theme') || 'light');
  const isDark = computed(() => theme.value === 'dark');

  // 初始化主题
  const initTheme = async () => {
    // 尝试获取系统主题
    if (window.electronAPI) {
      try {
        const systemTheme = await window.electronAPI.getSystemTheme();
        if (!localStorage.getItem('theme')) {
          theme.value = systemTheme;
        }
      } catch (error) {
        console.error('获取系统主题失败:', error);
      }
    }

    // 应用主题
    applyTheme();
  };

  // 切换主题
  const toggleTheme = () => {
    theme.value = theme.value === 'light' ? 'dark' : 'light';
    localStorage.setItem('theme', theme.value);
    applyTheme();
  };

  // 设置主题
  const setTheme = (newTheme) => {
    if (['light', 'dark'].includes(newTheme)) {
      theme.value = newTheme;
      localStorage.setItem('theme', newTheme);
      applyTheme();
    }
  };

  // 应用主题到 DOM
  const applyTheme = () => {
    const root = document.documentElement;

    if (theme.value === 'dark') {
      root.classList.add('dark');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      root.style.colorScheme = 'light';
    }
  };

  // 监听系统主题变化
  const setupSystemThemeListener = () => {
    if (window.electronAPI) {
      window.electronAPI.onThemeChanged((systemTheme) => {
        if (!localStorage.getItem('theme')) {
          theme.value = systemTheme;
          applyTheme();
        }
      });
    }
  };

  // 清理监听器
  const cleanupSystemThemeListener = () => {
    if (window.electronAPI) {
      window.electronAPI.removeThemeListener();
    }
  };

  // 主题颜色配置
  const colors = computed(() => ({
    light: {
      primary: '#3B82F6',
      secondary: '#10B981',
      danger: '#EF4444',
      warning: '#F59E0B',
      background: '#F8FAFC',
      card: '#FFFFFF',
      text: '#1F2937',
      border: '#E5E7EB',
    },
    dark: {
      primary: '#60A5FA',
      secondary: '#34D399',
      danger: '#F87171',
      warning: '#FBBF24',
      background: '#111827',
      card: '#1F2937',
      text: '#F9FAFB',
      border: '#374151',
    },
  }));

  // 获取当前主题颜色
  const currentColors = computed(() => colors.value[theme.value]);

  return {
    theme,
    isDark,
    currentColors,
    initTheme,
    toggleTheme,
    setTheme,
    applyTheme,
    setupSystemThemeListener,
    cleanupSystemThemeListener,
  };
});