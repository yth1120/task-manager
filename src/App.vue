<template>
  <!-- 登录界面 -->
  <LoginForm v-if="!userStore.isAuthenticated" @login-success="handleLoginSuccess" />

  <!-- 主界面 -->
  <div v-else id="app" class="max-w-4xl mx-auto p-5 md:p-8 animate-fade-in">
    <!-- 顶部栏 -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
      <div class="flex items-center gap-3">
        <i class="fa fa-clipboard-check text-3xl text-primary"></i>
        <h1 class="text-[clamp(1.5rem,3vw,2rem)] font-bold" data-lang="app_title">{{ t('app_title') }}</h1>
      </div>
      <div class="flex gap-2 flex-wrap">
        <button @click="setLanguage('zh')" id="langCN"
                :class="`px-3 py-1.5 rounded-lg text-sm transition-all-300 flex items-center justify-center ${currentLang === 'zh' ? 'bg-primary text-white hover:bg-primary/90' : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700'}`">
          中文
        </button>
        <button @click="setLanguage('en')" id="langEN"
                :class="`px-3 py-1.5 rounded-lg text-sm transition-all-300 flex items-center justify-center ${currentLang === 'en' ? 'bg-primary text-white hover:bg-primary/90' : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700'}`">
          English
        </button>
        <button @click="themeStore.toggleTheme" id="toggleTheme" class="px-3 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 transition-all-300 flex items-center justify-center">
          <i class="fa fa-moon-o dark:hidden"></i>
          <i class="fa fa-sun-o hidden dark:inline"></i>
        </button>
        <button @click="showUserSettings = true" class="px-3 py-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 text-sm transition-all-300 flex items-center justify-center">
          <i class="fa fa-user-cog mr-1"></i> {{ t('settings') }}
        </button>
        <button @click="handleLogout" id="logoutBtn" class="px-3 py-1.5 rounded-lg bg-danger/10 text-danger hover:bg-danger/20 text-sm transition-all-300 flex items-center justify-center">
          <i class="fa fa-sign-out mr-1"></i> <span data-lang="logout">{{ t('logout') }}</span>
        </button>
      </div>
    </div>

    <!-- 统计卡片 -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
      <div class="bg-white dark:bg-darkCard rounded-xl p-5 shadow-sm hover:shadow-md transition-all-300 animate-slide-up">
        <p class="text-sm text-slate-500 dark:text-slate-400" data-lang="total">{{ t('total') }}</p>
        <p id="statTotal" class="text-3xl font-bold mt-1">{{ taskStore.tasks.length }}</p>
      </div>
      <div class="bg-white dark:bg-darkCard rounded-xl p-5 shadow-sm hover:shadow-md transition-all-300 animate-slide-up" style="animation-delay: 0.1s">
        <p class="text-sm text-slate-500 dark:text-slate-400" data-lang="pending">{{ t('pending') }}</p>
        <p id="statPending" class="text-3xl font-bold mt-1 text-warning">{{ taskStore.pendingTasks.length }}</p>
      </div>
      <div class="bg-white dark:bg-darkCard rounded-xl p-5 shadow-sm hover:shadow-md transition-all-300 animate-slide-up" style="animation-delay: 0.2s">
        <p class="text-sm text-slate-500 dark:text-slate-400" data-lang="completed">{{ t('completed') }}</p>
        <p id="statDone" class="text-3xl font-bold mt-1 text-success">{{ taskStore.completedTasks.length }}</p>
      </div>
    </div>

    <!-- 添加任务 -->
    <div class="bg-white dark:bg-darkCard rounded-xl p-5 shadow-sm mb-6">
      <div class="flex gap-3">
        <input v-model="newTask"
               @keydown.enter="addTask"
               id="taskInput"
               type="text"
               :placeholder="currentLang === 'zh' ? '输入新任务...' : 'New task...'"
               class="flex-1 px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent outline-none focus:ring-2 focus:ring-primary/40">
        <button @click="addTask" id="addTask" class="bg-primary hover:bg-primary/90 text-white px-5 py-3 rounded-lg font-medium transition-all-300 flex items-center justify-center gap-1">
          <i class="fa fa-plus"></i> <span data-lang="add">{{ t('add') }}</span>
        </button>
      </div>
    </div>

    <!-- 任务列表 -->
    <div id="taskList" class="space-y-3">
      <div v-if="taskStore.tasks.length === 0" class="text-center py-12">
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 mb-4">
          <svg class="w-10 h-10 text-blue-500 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <h3 class="text-xl font-semibold text-gray-800 dark:text-white mb-2">暂无任务</h3>
        <p class="text-gray-600 dark:text-gray-400">点击上方输入框添加你的第一个任务</p>
      </div>

      <div v-else>
        <!-- 任务列表 -->
        <div class="space-y-3">
          <TaskItem v-for="task in filteredTasks"
                    :key="task.id"
                    :task="task"
                    @deleted="handleTaskDeleted"
                    @updated="handleTaskUpdated" />
        </div>
      </div>
    </div>
  </div>

  <!-- 用户设置组件 -->
  <UserSettings :show="showUserSettings" @close="showUserSettings = false" />
</template>

<script setup>
import { ref, computed } from 'vue';
import { useTaskStore } from '@/stores/taskStore';
import { useUserStore } from '@/stores/userStore';
import { useThemeStore } from '@/stores/themeStore';
import { useI18n } from '@/i18n/i18n';
import LoginForm from '@/components/LoginForm.vue';
import TaskItem from '@/components/TaskItem.vue';
import UserSettings from '@/components/UserSettings.vue';

// 导入 Store
const taskStore = useTaskStore();
const userStore = useUserStore();
const themeStore = useThemeStore();
const { currentLang, setLanguage, t } = useI18n();

// 状态
const newTask = ref('');
const filter = ref('all');
const showUserSettings = ref(false);

// 计算属性
const filteredTasks = computed(() => {
  switch (filter.value) {
    case 'pending':
      return taskStore.pendingTasks;
    case 'completed':
      return taskStore.completedTasks;
    default:
      // 按照HTML版本的逻辑：未完成的任务在前，已完成的任务在后
      return [...taskStore.pendingTasks, ...taskStore.completedTasks];
  }
});

// 方法
const handleLoginSuccess = () => {
  console.log('登录成功');
};

const handleLogout = () => {
  userStore.logout();
};

const addTask = () => {
  if (newTask.value.trim()) {
    taskStore.addTask(newTask.value.trim());
    newTask.value = '';
  }
};

const handleTaskDeleted = () => {
  console.log('任务已删除');
};

const handleTaskUpdated = () => {
  console.log('任务已更新');
};
</script>