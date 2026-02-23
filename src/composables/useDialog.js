// src/composables/useDialog.js
import { ref } from 'vue';
import { useI18n } from '@/i18n/i18n';

/**
 * 对话框组合式函数
 * 提供类似浏览器原生 confirm() 和 prompt() 的功能
 */
export function useDialog() {
  const { t } = useI18n();

  const dialogState = ref({
    visible: false,
    type: 'confirm', // 'confirm' 或 'prompt'
    title: '',
    message: '',
    confirmMessage: '',
    placeholder: '',
    defaultValue: '',
    confirmButtonText: '',
    showCancel: true
  });

  let resolvePromise = null;
  let rejectPromise = null;

  /**
   * 显示确认对话框
   * @param {string} message - 确认消息
   * @param {string} title - 对话框标题
   * @returns {Promise<boolean>} - 用户选择结果
   */
  const confirm = (message, title = '确认') => {
    return new Promise((resolve, reject) => {
      dialogState.value = {
        visible: true,
        type: 'confirm',
        title,
        confirmMessage: message,
        confirmButtonText: '确定',
        showCancel: true
      };
      resolvePromise = resolve;
      rejectPromise = reject;
    });
  };

  /**
   * 显示提示对话框
   * @param {string} message - 提示消息
   * @param {string} defaultValue - 默认值
   * @param {string} title - 对话框标题
   * @returns {Promise<string|null>} - 用户输入的值，取消时为null
   */
  const prompt = (message, defaultValue = '', title = '输入') => {
    return new Promise((resolve, reject) => {
      dialogState.value = {
        visible: true,
        type: 'prompt',
        title,
        message,
        placeholder: message,
        defaultValue,
        confirmButtonText: '确定',
        showCancel: true
      };
      resolvePromise = resolve;
      rejectPromise = reject;
    });
  };

  /**
   * 处理确认操作
   * @param {any} value - 确认的值
   */
  const handleConfirm = (value) => {
    if (resolvePromise) {
      resolvePromise(value);
      cleanup();
    }
  };

  /**
   * 处理取消操作
   * @param {any} value - 取消的值
   */
  const handleCancel = (value) => {
    if (rejectPromise) {
      rejectPromise(value);
      cleanup();
    } else if (resolvePromise) {
      // 对于prompt，取消时返回null
      resolvePromise(null);
      cleanup();
    }
  };

  /**
   * 清理状态
   */
  const cleanup = () => {
    dialogState.value.visible = false;
    resolvePromise = null;
    rejectPromise = null;
  };

  /**
   * 更新对话框可见状态
   * @param {boolean} visible - 是否可见
   */
  const updateVisible = (visible) => {
    dialogState.value.visible = visible;
    if (!visible) {
      // 对话框被关闭（例如点击遮罩层）
      if (rejectPromise) {
        rejectPromise(new Error('Dialog closed'));
      } else if (resolvePromise) {
        // 对于prompt，关闭时返回null
        resolvePromise(null);
      }
      cleanup();
    }
  };

  return {
    dialogState,
    confirm,
    prompt,
    handleConfirm,
    handleCancel,
    updateVisible
  };
}