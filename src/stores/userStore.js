// src/stores/userStore.js
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useUserStore = defineStore('user', () => {
  // 状态
  const user = ref(null);
  const isAuthenticated = computed(() => !!user.value);

  // 初始化默认用户凭证（如果不存在）
  const initDefaultCredentials = () => {
    const defaultCredentials = {
      username: 'admin',
      password: '123456',
    };

    // 检查是否有存储的用户凭证
    const storedCredentials = localStorage.getItem('user_credentials');
    if (!storedCredentials) {
      // 首次运行，只存储默认凭证，不创建用户数据
      localStorage.setItem('user_credentials', JSON.stringify(defaultCredentials));
    }
  };

  // 初始化默认凭证
  initDefaultCredentials();

  // 开发环境：清理旧的用户数据（确保从干净状态开始）
  const cleanupOldUserData = () => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        // 如果旧的用户数据没有rememberMe字段，清除它
        if (userData && userData.rememberMe === undefined) {
          console.log('清理旧的用户数据（缺少rememberMe字段）');
          localStorage.removeItem('user');
        }
      } catch (error) {
        console.error('清理旧用户数据时出错:', error);
        localStorage.removeItem('user');
      }
    }
  };

  // 执行清理
  cleanupOldUserData();

  // 获取存储的凭证
  const getStoredCredentials = () => {
    try {
      const credentials = localStorage.getItem('user_credentials');
      if (credentials) {
        return JSON.parse(credentials);
      }
    } catch (error) {
      console.error('解析用户凭证失败:', error);
    }

    // 如果无法获取凭证，返回默认凭证
    return { username: 'admin', password: '123456' };
  };

  // 登录
  const login = (username, password, rememberMe = false) => {
    const credentials = getStoredCredentials();

    if (username === credentials.username && password === credentials.password) {
      const userData = {
        id: 1,
        username: credentials.username,
        name: '管理员',
        email: 'admin@example.com',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + credentials.username,
        role: 'admin',
        loginTime: new Date().toISOString(),
        rememberMe: rememberMe, // 记录用户是否选择记住登录状态
      };

      user.value = userData;

      // 只有用户选择"记住我"时才保存到localStorage
      if (rememberMe) {
        localStorage.setItem('user', JSON.stringify(userData));
        console.log('用户选择记住登录状态，已保存到localStorage');
      } else {
        // 不保存到localStorage，会话级别的登录
        console.log('用户未选择记住登录状态，仅当前会话有效');
      }

      return { success: true, user: userData };
    }

    return { success: false, error: 'loginErr' }; // 使用翻译键
  };

  // 登出
  const logout = () => {
    user.value = null;
    localStorage.removeItem('user');
    console.log('用户已登出，已清除用户数据');
  };

  // 更新用户信息
  const updateUser = (updates) => {
    if (user.value) {
      user.value = { ...user.value, ...updates };
      localStorage.setItem('user', JSON.stringify(user.value));
    }
  };

  // 更新用户名
  const updateUsername = (newUsername, currentPassword) => {
    if (!user.value) {
      return { success: false, error: 'not_logged_in' };
    }

    const credentials = getStoredCredentials();

    // 验证当前密码
    if (currentPassword !== credentials.password) {
      return { success: false, error: 'wrong_password' };
    }

    // 更新凭证
    credentials.username = newUsername;
    localStorage.setItem('user_credentials', JSON.stringify(credentials));

    // 更新用户信息
    user.value.username = newUsername;
    user.value.avatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${newUsername}`;
    localStorage.setItem('user', JSON.stringify(user.value));

    return { success: true, message: 'username_updated' };
  };

  // 更新密码
  const updatePassword = (currentPassword, newPassword, confirmPassword) => {
    if (!user.value) {
      return { success: false, error: 'not_logged_in' };
    }

    const credentials = getStoredCredentials();

    // 验证当前密码
    if (currentPassword !== credentials.password) {
      return { success: false, error: 'wrong_password' };
    }

    // 验证新密码和确认密码是否一致
    if (newPassword !== confirmPassword) {
      return { success: false, error: 'password_mismatch' };
    }

    // 验证新密码不能与旧密码相同
    if (currentPassword === newPassword) {
      return { success: false, error: 'same_password' };
    }

    // 更新凭证
    credentials.password = newPassword;
    localStorage.setItem('user_credentials', JSON.stringify(credentials));

    return { success: true, message: 'password_updated' };
  };

  // 检查是否已登录 - 只恢复选择了"记住我"的用户
  const checkAuth = () => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        // 验证用户数据是否完整且用户选择了"记住我"
        if (userData && userData.id && userData.username && userData.rememberMe === true) {
          user.value = userData;
          console.log('从localStorage恢复用户会话（用户选择了"记住我"）:', userData.username);
        } else {
          console.log('用户未选择"记住我"或数据不完整，需要重新登录');
          // 清除无效的用户数据
          localStorage.removeItem('user');
          user.value = null;
        }
      } catch (error) {
        console.error('解析用户数据失败:', error);
        // 清除损坏的用户数据
        localStorage.removeItem('user');
        user.value = null;
      }
    } else {
      console.log('没有找到用户数据，需要登录');
      user.value = null;
    }
  };

  // 初始化时检查登录状态
  checkAuth();

  return {
    user,
    isAuthenticated,
    login,
    logout,
    updateUser,
    updateUsername,
    updatePassword,
    checkAuth,
  };
});