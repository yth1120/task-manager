<template>
  <div class="stats-card p-6 rounded-xl shadow-lg transition-all-300 hover:shadow-xl"
       :class="[colorClass, { 'glass': glass }]">
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center">
        <div class="p-3 rounded-lg bg-white/20 mr-4">
          <slot name="icon">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="iconPath" />
            </svg>
          </slot>
        </div>
        <div>
          <h3 class="text-lg font-semibold text-white">{{ title }}</h3>
          <p class="text-sm opacity-80 text-white/90">{{ description }}</p>
        </div>
      </div>
      <div v-if="trend" class="flex items-center text-sm" :class="trendClass">
        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="trendIcon" />
        </svg>
        {{ trend }}
      </div>
    </div>
    <div class="text-3xl font-bold mb-2 text-white">{{ value }}</div>
    <div v-if="progress !== undefined" class="mt-4">
      <div class="flex justify-between text-sm mb-1 text-white/90">
        <span>进度</span>
        <span>{{ progress }}%</span>
      </div>
      <div class="h-2 bg-white/30 rounded-full overflow-hidden">
        <div class="h-full rounded-full transition-all duration-500" :style="{ width: progress + '%' }"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  value: {
    type: [String, Number],
    required: true
  },
  color: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'danger', 'warning', 'success'].includes(value)
  },
  iconPath: {
    type: String,
    default: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2'
  },
  trend: {
    type: String,
    default: ''
  },
  trendType: {
    type: String,
    default: 'neutral',
    validator: (value) => ['up', 'down', 'neutral'].includes(value)
  },
  progress: {
    type: Number,
    default: undefined
  },
  glass: {
    type: Boolean,
    default: false
  }
});

const colorClass = computed(() => {
  const colors = {
    primary: 'bg-gradient-to-br from-blue-500 to-blue-600 text-white',
    secondary: 'bg-gradient-to-br from-green-500 to-green-600 text-white',
    danger: 'bg-gradient-to-br from-red-500 to-red-600 text-white',
    warning: 'bg-gradient-to-br from-yellow-500 to-yellow-600 text-white',
    success: 'bg-gradient-to-br from-emerald-500 to-emerald-600 text-white'
  };
  return colors[props.color] || colors.primary;
});

const trendClass = computed(() => {
  const classes = {
    up: 'text-green-300',
    down: 'text-red-300',
    neutral: 'text-gray-300'
  };
  return classes[props.trendType] || classes.neutral;
});

const trendIcon = computed(() => {
  const icons = {
    up: 'M5 10l7-7m0 0l7 7m-7-7v18',
    down: 'M19 14l-7 7m0 0l-7-7m7 7V3',
    neutral: 'M8 9l4-4 4 4m0 6l-4 4-4-4'
  };
  return icons[props.trendType] || icons.neutral;
});
</script>

<style scoped>
.stats-card {
  backdrop-filter: blur(10px);
}
</style>