// src/i18n/i18n.js
import { ref, computed } from 'vue';

const translations = {
  zh: {
    login_title: "任务管理系统登录",
    login_desc: "登录后管理你的任务",
    username: "用户名",
    password: "密码",
    login: "登录",
    logout: "退出",
    app_title: "任务管理系统",
    total: "全部任务",
    pending: "待完成",
    completed: "已完成",
    add: "添加",
    add_task_placeholder: "输入新任务...",
    edit: "编辑",
    del: "删除",
    done: "已完成",
    undone: "未完成",
    sureDel: "确定删除此任务？",
    loginErr: "用户名或密码错误（admin / 123456）",
    remember_me: "记住我",
    settings: "设置",
    user_settings: "用户设置",
    change_username: "修改用户名",
    change_password: "修改密码",
    current_username: "当前用户名",
    new_username: "新用户名",
    current_password: "当前密码",
    new_password: "新密码",
    confirm_password: "确认新密码",
    update_username: "更新用户名",
    update_password: "更新密码",
    close: "关闭",
    username_updated: "用户名更新成功",
    password_updated: "密码更新成功",
    password_mismatch: "新密码和确认密码不一致",
    same_password: "新密码不能与当前密码相同",
    wrong_password: "当前密码错误",
    not_logged_in: "用户未登录",
    edit_task: "编辑任务",
    delete_confirm: "确定删除此任务？",
    confirm: "确认",
    input: "输入",
    cancel: "取消",
    ok: "确定"
  },
  en: {
    login_title: "Task Manager Login",
    login_desc: "Manage your tasks after login",
    username: "Username",
    password: "Password",
    login: "Login",
    logout: "Logout",
    app_title: "Task Manager",
    total: "Total Tasks",
    pending: "Pending",
    completed: "Completed",
    add: "Add",
    add_task_placeholder: "New task...",
    edit: "Edit",
    del: "Delete",
    done: "Done",
    undone: "Undone",
    sureDel: "Delete this task?",
    loginErr: "Wrong username or password (admin / 123456)",
    remember_me: "Remember me",
    settings: "Settings",
    user_settings: "User Settings",
    change_username: "Change Username",
    change_password: "Change Password",
    current_username: "Current Username",
    new_username: "New Username",
    current_password: "Current Password",
    new_password: "New Password",
    confirm_password: "Confirm New Password",
    update_username: "Update Username",
    update_password: "Update Password",
    close: "Close",
    username_updated: "Username updated successfully",
    password_updated: "Password updated successfully",
    password_mismatch: "New password and confirmation do not match",
    same_password: "New password cannot be the same as current password",
    wrong_password: "Current password is incorrect",
    not_logged_in: "User not logged in",
    edit_task: "Edit Task",
    delete_confirm: "Delete this task?",
    confirm: "Confirm",
    input: "Input",
    cancel: "Cancel",
    ok: "OK"
  }
};

const currentLang = ref(localStorage.getItem('lang') || 'zh');

export function useI18n() {
  const setLanguage = (lang) => {
    currentLang.value = lang;
    localStorage.setItem('lang', lang);
  };

  const t = (key) => {
    return translations[currentLang.value][key] || key;
  };

  return {
    currentLang: computed(() => currentLang.value),
    setLanguage,
    t
  };
}