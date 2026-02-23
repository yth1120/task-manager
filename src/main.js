import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';

// 导入 Tailwind CSS
import '../index.css';

const app = createApp(App);
const pinia = createPinia();

// 使用 Pinia
app.use(pinia);

// 挂载应用
app.mount('#app');