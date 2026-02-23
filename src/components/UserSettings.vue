<template>
  <div class="user-settings">
    <!-- 用户设置模态框 -->
    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-black/40 dark:bg-black/60" @click="closeModal"></div>
      <div class="relative bg-white dark:bg-darkCard w-full max-w-md rounded-2xl shadow-xl p-8 animate-fade-in">
        <!-- 标题 -->
        <div class="text-center mb-6">
          <i class="fa fa-user-circle text-4xl text-primary mb-2"></i>
          <h2 class="text-2xl font-bold">{{ t('user_settings') }}</h2>
          <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">{{ t('change_username') }}和{{ t('change_password') }}</p>
        </div>

        <!-- 选项卡 -->
        <div class="flex border-b border-slate-200 dark:border-slate-700 mb-6">
          <button @click="activeTab = 'username'"
                  class="flex-1 py-3 text-sm font-medium transition-all-300 flex items-center justify-center"
                  :class="activeTab === 'username' ? 'text-primary border-b-2 border-primary' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'">
            {{ t('change_username') }}
          </button>
          <button @click="activeTab = 'password'"
                  class="flex-1 py-3 text-sm font-medium transition-all-300 flex items-center justify-center"
                  :class="activeTab === 'password' ? 'text-primary border-b-2 border-primary' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'">
            {{ t('change_password') }}
          </button>
        </div>

        <!-- 修改用户名表单 -->
        <div v-if="activeTab === 'username'" class="space-y-4">
          <div>
            <label class="text-sm font-medium block mb-1">{{ t('current_username') }}</label>
            <div class="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
              {{ userStore.user?.username }}
            </div>
          </div>

          <div>
            <label class="text-sm font-medium block mb-1">{{ t('new_username') }}</label>
            <input v-model="usernameForm.newUsername"
                   type="text"
                   class="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-darkCard outline-none focus:ring-2 focus:ring-primary/50"
                   :placeholder="t('new_username')">
          </div>

          <div>
            <label class="text-sm font-medium block mb-1">{{ t('current_password') }}</label>
            <input v-model="usernameForm.currentPassword"
                   type="password"
                   class="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-darkCard outline-none focus:ring-2 focus:ring-primary/50"
                   :placeholder="t('current_password')">
          </div>

          <button @click="updateUsername"
                  :disabled="!canUpdateUsername"
                  class="w-full bg-primary hover:bg-primary/90 text-white font-medium py-2.5 rounded-lg transition-all-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
            <i class="fa fa-save"></i> {{ t('update_username') }}
          </button>

          <p v-if="usernameError" class="text-danger text-sm text-center">{{ t(usernameError) }}</p>
          <p v-if="usernameSuccess" class="text-success text-sm text-center">{{ t(usernameSuccess) }}</p>
        </div>

        <!-- 修改密码表单 -->
        <div v-else class="space-y-4">
          <div>
            <label class="text-sm font-medium block mb-1">{{ t('current_password') }}</label>
            <input v-model="passwordForm.currentPassword"
                   type="password"
                   class="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-darkCard outline-none focus:ring-2 focus:ring-primary/50"
                   :placeholder="t('current_password')">
          </div>

          <div>
            <label class="text-sm font-medium block mb-1">{{ t('new_password') }}</label>
            <input v-model="passwordForm.newPassword"
                   type="password"
                   class="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-darkCard outline-none focus:ring-2 focus:ring-primary/50"
                   :placeholder="t('new_password')">
          </div>

          <div>
            <label class="text-sm font-medium block mb-1">{{ t('confirm_password') }}</label>
            <input v-model="passwordForm.confirmPassword"
                   type="password"
                   class="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-darkCard outline-none focus:ring-2 focus:ring-primary/50"
                   :placeholder="t('confirm_password')">
          </div>

          <button @click="updatePassword"
                  :disabled="!canUpdatePassword"
                  class="w-full bg-primary hover:bg-primary/90 text-white font-medium py-2.5 rounded-lg transition-all-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
            <i class="fa fa-key"></i> {{ t('update_password') }}
          </button>

          <p v-if="passwordError" class="text-danger text-sm text-center">{{ t(passwordError) }}</p>
          <p v-if="passwordSuccess" class="text-success text-sm text-center">{{ t(passwordSuccess) }}</p>
        </div>

        <!-- 关闭按钮 -->
        <button @click="closeModal"
                class="w-full mt-6 px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all-300 flex items-center justify-center">
          {{ t('close') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useUserStore } from '@/stores/userStore';
import { useI18n } from '@/i18n/i18n';

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['close']);

const userStore = useUserStore();
const { t } = useI18n();

// 状态
const showModal = ref(props.show);
const activeTab = ref('username');

// 表单数据
const usernameForm = ref({
  newUsername: '',
  currentPassword: ''
});

const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
});

// 消息状态
const usernameError = ref('');
const usernameSuccess = ref('');
const passwordError = ref('');
const passwordSuccess = ref('');

// 计算属性
const canUpdateUsername = computed(() => {
  return usernameForm.value.newUsername.trim() && usernameForm.value.currentPassword.trim();
});

const canUpdatePassword = computed(() => {
  return passwordForm.value.currentPassword.trim() &&
         passwordForm.value.newPassword.trim() &&
         passwordForm.value.confirmPassword.trim();
});

// 方法
const closeModal = () => {
  showModal.value = false;
  resetForms();
  emit('close');
};

const resetForms = () => {
  usernameForm.value = { newUsername: '', currentPassword: '' };
  passwordForm.value = { currentPassword: '', newPassword: '', confirmPassword: '' };
  usernameError.value = '';
  usernameSuccess.value = '';
  passwordError.value = '';
  passwordSuccess.value = '';
};

const updateUsername = async () => {
  if (!canUpdateUsername.value) return;

  usernameError.value = '';
  usernameSuccess.value = '';

  const result = userStore.updateUsername(
    usernameForm.value.newUsername.trim(),
    usernameForm.value.currentPassword
  );

  if (result.success) {
    usernameSuccess.value = result.message;
    usernameForm.value = { newUsername: '', currentPassword: '' };

    // 3秒后清空成功消息
    setTimeout(() => {
      usernameSuccess.value = '';
    }, 3000);
  } else {
    usernameError.value = result.error;
  }
};

const updatePassword = async () => {
  if (!canUpdatePassword.value) return;

  passwordError.value = '';
  passwordSuccess.value = '';

  const result = userStore.updatePassword(
    passwordForm.value.currentPassword,
    passwordForm.value.newPassword,
    passwordForm.value.confirmPassword
  );

  if (result.success) {
    passwordSuccess.value = result.message;
    passwordForm.value = { currentPassword: '', newPassword: '', confirmPassword: '' };

    // 3秒后清空成功消息
    setTimeout(() => {
      passwordSuccess.value = '';
    }, 3000);
  } else {
    passwordError.value = result.error;
  }
};

// 监听props变化
watch(() => props.show, (newVal) => {
  showModal.value = newVal;
  if (newVal) {
    resetForms();
    activeTab.value = 'username';
  }
});

// 监听模态框状态
watch(showModal, (newVal) => {
  if (!newVal) {
    emit('close');
  }
});
</script>

<style scoped>
.user-settings {
  z-index: 100;
}
</style>