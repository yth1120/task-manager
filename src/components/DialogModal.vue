<template>
  <!-- 对话框遮罩 -->
  <div v-if="visible" class="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div class="absolute inset-0 bg-black/50 dark:bg-black/70" @click="handleCancel"></div>

    <!-- 对话框内容 -->
    <div class="relative bg-white dark:bg-darkCard w-full max-w-md rounded-2xl shadow-xl animate-fade-in">
      <!-- 标题 -->
      <div v-if="title" class="px-6 pt-6 pb-4 border-b border-slate-200 dark:border-slate-700">
        <h3 class="text-lg font-semibold text-slate-800 dark:text-slate-200">{{ title }}</h3>
      </div>

      <!-- 内容区域 -->
      <div class="px-6 py-5">
        <!-- 提示信息 -->
        <p v-if="message" class="text-slate-600 dark:text-slate-400 mb-4">{{ message }}</p>

        <!-- 输入框（用于prompt模式） -->
        <input v-if="type === 'prompt'"
               v-model="inputValue"
               ref="inputRef"
               type="text"
               class="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-darkCard outline-none focus:ring-2 focus:ring-primary/50"
               :placeholder="placeholder || t('input')"
               @keydown.enter="handleConfirm"
               @keydown.esc="handleCancel" />

        <!-- 确认信息（用于confirm模式） -->
        <p v-if="type === 'confirm'" class="text-slate-700 dark:text-slate-300">{{ confirmMessage }}</p>
      </div>

      <!-- 按钮区域 -->
      <div class="px-6 py-4 border-t border-slate-200 dark:border-slate-700 flex justify-end gap-3">
        <!-- 取消按钮 -->
        <button v-if="type === 'prompt' || showCancel"
                @click="handleCancel"
                class="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all-300">
          {{ t('cancel') }}
        </button>

        <!-- 确认按钮 -->
        <button @click="handleConfirm"
                class="px-4 py-2 rounded-lg bg-primary hover:bg-primary/90 text-white transition-all-300">
          {{ confirmButtonText || t('ok') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick, onMounted } from 'vue';
import { useI18n } from '@/i18n/i18n';

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  type: {
    type: String,
    default: 'confirm', // 'confirm' 或 'prompt'
    validator: (value) => ['confirm', 'prompt'].includes(value)
  },
  title: {
    type: String,
    default: ''
  },
  message: {
    type: String,
    default: ''
  },
  confirmMessage: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: ''
  },
  defaultValue: {
    type: String,
    default: ''
  },
  confirmButtonText: {
    type: String,
    default: ''
  },
  showCancel: {
    type: Boolean,
    default: true
  }
});

const { t } = useI18n();

const emit = defineEmits(['confirm', 'cancel', 'update:visible']);

const inputValue = ref(props.defaultValue);
const inputRef = ref(null);

// 监听visible变化，当对话框显示时自动聚焦输入框
watch(() => props.visible, (newVal) => {
  if (newVal && props.type === 'prompt') {
    nextTick(() => {
      if (inputRef.value) {
        inputRef.value.focus();
        inputRef.value.select();
      }
    });
  }
});

// 组件挂载时设置默认值
onMounted(() => {
  inputValue.value = props.defaultValue;
});

const handleConfirm = () => {
  if (props.type === 'prompt') {
    emit('confirm', inputValue.value.trim());
  } else {
    emit('confirm', true);
  }
  emit('update:visible', false);
};

const handleCancel = () => {
  if (props.type === 'prompt') {
    emit('cancel', null);
  } else {
    emit('cancel', false);
  }
  emit('update:visible', false);
};

// 监听defaultValue变化
watch(() => props.defaultValue, (newVal) => {
  inputValue.value = newVal;
});
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.2s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>