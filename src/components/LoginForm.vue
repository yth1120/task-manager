<template>
  <div id="loginPanel" class="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div class="absolute inset-0 bg-black/40 dark:bg-black/60"></div>
    <div class="relative bg-white dark:bg-darkCard w-full max-w-md rounded-2xl shadow-xl p-8 animate-fade-in">
      <!-- Logo/标题 -->
      <div class="text-center mb-6">
        <i class="fa fa-tasks text-4xl text-primary mb-2"></i>
        <h2 class="text-2xl font-bold">{{ t('login_title') }}</h2>
        <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">{{ t('login_desc') }}</p>
      </div>

      <!-- 登录表单 -->
      <form @submit.prevent="handleLogin" class="space-y-4">
        <!-- 用户名 -->
        <div>
          <label class="text-sm font-medium block mb-1">{{ t('username') }}</label>
          <input v-model="form.username"
                 type="text"
                 required
                 class="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-darkCard outline-none focus:ring-2 focus:ring-primary/50"
                 :placeholder="t('username')"
                 :class="{ 'border-red-500': error }" />
        </div>

        <!-- 密码 -->
        <div>
          <label class="text-sm font-medium block mb-1">{{ t('password') }}</label>
          <input v-model="form.password"
                 type="password"
                 required
                 class="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-darkCard outline-none focus:ring-2 focus:ring-primary/50"
                 :placeholder="t('password')"
                 :class="{ 'border-red-500': error }" />
        </div>

        <!-- 记住我选项 -->
        <div class="flex items-center">
          <input v-model="form.rememberMe"
                 type="checkbox"
                 id="rememberMe"
                 class="h-4 w-4 text-primary rounded border-slate-300 dark:border-slate-700 focus:ring-primary/50" />
          <label for="rememberMe" class="ml-2 text-sm text-slate-600 dark:text-slate-400">
            {{ t('remember_me') }}
          </label>
        </div>

        <!-- 登录按钮 -->
        <button type="submit"
                :disabled="loading"
                class="w-full bg-primary hover:bg-primary/90 text-white font-medium py-2.5 rounded-lg transition-all-300 flex items-center justify-center gap-2">
          <i class="fa fa-sign-in"></i> {{ t('login') }}
        </button>

        <!-- 错误提示 -->
        <p v-if="error" class="text-danger text-sm text-center">{{ t(error) }}</p>
      </form>

      <!-- 语言切换 -->
      <div class="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
        <div class="flex items-center justify-between">
          <span class="text-sm text-gray-600 dark:text-gray-400">语言 / Language</span>
          <div class="flex space-x-2">
            <button @click="setLanguage('zh')"
                    class="px-3 py-1 text-sm rounded-lg transition-all-300 flex items-center justify-center"
                    :class="currentLang === 'zh' ? 'bg-primary text-white hover:bg-primary/90' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'">
              中文
            </button>
            <button @click="setLanguage('en')"
                    class="px-3 py-1 text-sm rounded-lg transition-all-300 flex items-center justify-center"
                    :class="currentLang === 'en' ? 'bg-primary text-white hover:bg-primary/90' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'">
              English
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useUserStore } from '@/stores/userStore';
import { useI18n } from '@/i18n/i18n';

const userStore = useUserStore();
const { t, currentLang, setLanguage } = useI18n();

const emit = defineEmits(['login-success']);

const form = reactive({
  username: '',
  password: '',
  rememberMe: false
});

const loading = ref(false);
const error = ref('');
const showPassword = ref(false);

const handleLogin = async () => {
  if (loading.value) return;

  loading.value = true;
  error.value = '';

  try {
    const result = userStore.login(form.username, form.password, form.rememberMe);

    if (result.success) {
      emit('login-success');
    } else {
      error.value = result.error;
    }
  } catch (err) {
    error.value = '登录过程中发生错误';
    console.error('登录错误:', err);
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.login-card {
  backdrop-filter: blur(20px);
  background: rgba(255, 255, 255, 0.9);
}

.dark .login-card {
  background: rgba(31, 41, 55, 0.9);
}

.glass {
  backdrop-filter: blur(8px);
}
</style>