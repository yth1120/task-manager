// src/stores/taskStore.js
import { defineStore } from 'pinia';

export const useTaskStore = defineStore('tasks', {
  state: () => ({
    tasks: JSON.parse(localStorage.getItem('tasks') || '[]'),
  }),

  getters: {
    pendingTasks: (state) => state.tasks.filter(task => !task.done),
    completedTasks: (state) => state.tasks.filter(task => task.done),
    sortedTasks: (state) => {
      const pending = state.tasks.filter(task => !task.done);
      const done = state.tasks.filter(task => task.done);
      return [...pending, ...done];
    }
  },

  actions: {
    addTask(text) {
      const now = new Date().toISOString();
      this.tasks.unshift({
        id: Date.now(),
        text,
        done: false,
        createdAt: now,
        completedAt: null
      });
      this.saveToLocalStorage();
    },

    toggleTaskDone(id) {
      const task = this.tasks.find(task => task.id === id);
      if (task) {
        task.done = !task.done;
        task.completedAt = task.done ? new Date().toISOString() : null;
        this.saveToLocalStorage();
      }
    },

    updateTask(id, newText) {
      const task = this.tasks.find(task => task.id === id);
      if (task) {
        task.text = newText;
        this.saveToLocalStorage();
      }
    },

    deleteTask(id) {
      this.tasks = this.tasks.filter(task => task.id !== id);
      this.saveToLocalStorage();
    },

    saveToLocalStorage() {
      localStorage.setItem('tasks', JSON.stringify(this.tasks));
    }
  }
});