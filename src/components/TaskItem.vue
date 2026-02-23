<template>
  <div class="bg-white dark:bg-darkCard rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm hover:shadow transition-all-300 animate-slide-up">
    <!-- 任务文本 -->
    <div :class="`flex-1 text-base ${task.done ? 'task-completed' : ''}`">
      {{ task.text }}
    </div>

    <!-- 操作按钮 -->
    <div class="flex gap-2 shrink-0">
      <!-- 完成/撤销按钮 -->
      <button @click="toggleDone"
              :class="`px-3 py-1.5 rounded-lg text-sm ${task.done ? 'bg-slate-200 dark:bg-slate-700' : 'bg-success text-white'} transition-all-300 flex items-center justify-center`">
        <i v-if="task.done" class="fa fa-undo mr-1"></i>
        <i v-else class="fa fa-check mr-1"></i>
        {{ task.done ? '撤销' : '完成' }}
      </button>

      <!-- 编辑按钮 -->
      <button @click="startEdit"
              class="px-3 py-1.5 rounded-lg bg-warning/10 text-warning text-sm hover:bg-warning/20 transition-all-300 flex items-center justify-center">
        <i class="fa fa-pencil mr-1"></i>编辑
      </button>

      <!-- 删除按钮 -->
      <button @click="confirmDelete"
              class="px-3 py-1.5 rounded-lg bg-danger/10 text-danger text-sm hover:bg-danger/20 transition-all-300 flex items-center justify-center">
        <i class="fa fa-trash mr-1"></i>删除
      </button>
    </div>

    <!-- 对话框组件 -->
    <DialogModal
      :visible="dialogState.visible"
      :type="dialogState.type"
      :title="dialogState.title"
      :message="dialogState.message"
      :confirm-message="dialogState.confirmMessage"
      :placeholder="dialogState.placeholder"
      :default-value="dialogState.defaultValue"
      :confirm-button-text="dialogState.confirmButtonText"
      :show-cancel="dialogState.showCancel"
      @confirm="handleConfirm"
      @cancel="handleCancel"
      @update:visible="updateVisible"
    />
  </div>
</template>

<script setup>
import { useTaskStore } from '@/stores/taskStore';
import { useDialog } from '@/composables/useDialog';
import { useI18n } from '@/i18n/i18n';
import DialogModal from '@/components/DialogModal.vue';

const props = defineProps({
  task: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['deleted', 'updated']);

const taskStore = useTaskStore();
const { t } = useI18n();
const { dialogState, prompt, confirm, handleConfirm, handleCancel, updateVisible } = useDialog();

const toggleDone = () => {
  taskStore.toggleTaskDone(props.task.id);
  emit('updated');
};

const startEdit = async () => {
  try {
    const newText = await prompt(t('edit_task'), props.task.text, t('edit_task'));
    if (newText !== null && newText.trim() && newText !== props.task.text) {
      taskStore.updateTask(props.task.id, newText.trim());
      emit('updated');
    }
  } catch (error) {
    console.log('用户取消了编辑');
  }
};

const confirmDelete = async () => {
  try {
    const result = await confirm(t('delete_confirm'), t('confirm'));
    if (result) {
      taskStore.deleteTask(props.task.id);
      emit('deleted');
    }
  } catch (error) {
    console.log('用户取消了删除');
  }
};
</script>

<style scoped>
.task-item {
  transition: all 0.3s ease;
}

.task-completed {
  text-decoration: line-through;
  opacity: 0.6;
}
</style>