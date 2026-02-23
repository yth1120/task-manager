# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a desktop task management application built with **Electron + Vue3 + TailwindCSS + Pinia**. It's a bilingual (Chinese/English) application with dark/light theme support, user authentication, and local data persistence.

## Development Commands

### Web Development (Vite)
- `npm run dev` - Start Vite development server (default: http://localhost:5173)
- `npm run build` - Build for production (outputs to `dist/` directory)
- `npm run preview` - Preview production build locally

### Electron Development
- `npm run electron` - Run Electron with built application (requires `npm run build` first)
- `npm run electron:dev` - Concurrently run Vite dev server and Electron (development mode)
- `npm run electron:build` - Build Electron application for distribution

### Code Quality
- `npm run lint` - Run ESLint with auto-fix

## Architecture

### Tech Stack
- **Frontend Framework**: Vue 3 (Composition API)
- **State Management**: Pinia (stores in `src/stores/`)
- **Styling**: TailwindCSS with custom configuration (`tailwind.config.js`)
- **Build Tool**: Vite with Vue plugin
- **Desktop Runtime**: Electron 29
- **Internationalization**: Custom i18n system (`src/i18n/i18n.js`)
- **Data Persistence**: Browser localStorage (no database)

### Project Structure
```
├── electron/           # Electron main process files
│   ├── main.js        # Electron entry point, window management
│   └── preload.js     # Safe IPC bridge between main/renderer processes
├── src/
│   ├── components/    # Vue components
│   │   ├── LoginForm.vue  # Authentication interface
│   │   ├── TaskItem.vue   # Individual task display/actions
│   │   └── StatsCard.vue  # Statistics card (currently unused)
│   ├── stores/        # Pinia state stores
│   │   ├── taskStore.js   # Task CRUD operations, localStorage persistence
│   │   ├── userStore.js   # User authentication, localStorage persistence
│   │   └── themeStore.js  # Theme management with system integration
│   ├── i18n/
│   │   └── i18n.js    # Internationalization system (zh/en)
│   ├── App.vue        # Main application component
│   └── main.js        # Vue application entry point
├── index.html         # HTML entry point with Tailwind/FontAwesome CDN
├── index.css          # Global CSS with Tailwind directives
├── vite.config.js     # Vite configuration with path aliases
├── tailwind.config.js # Tailwind theme customization
└── package.json       # Project dependencies and scripts
```

### Key Architectural Patterns

#### 1. State Management (Pinia Stores)
- **taskStore**: Manages tasks with localStorage persistence. Tasks are stored as objects with `id`, `text`, `done`, `createdAt`, `completedAt` fields.
- **userStore**: Handles authentication with hardcoded credentials (admin/123456). User data persists in localStorage.
- **themeStore**: Manages dark/light themes with system theme detection via Electron IPC.

#### 2. Data Flow
- All data operations go through Pinia stores
- Stores automatically persist to localStorage on changes
- Components subscribe to store state via computed properties
- No API calls or database - purely local storage

#### 3. Electron Integration
- **Main Process** (`electron/main.js`): Window management and system theme IPC
- **Preload Script** (`electron/preload.js`): Exposes safe Electron APIs to renderer
- **Theme Store** (`src/stores/themeStore.js`): Bridges web app with system theme

#### 4. Internationalization
- Custom i18n system with Chinese (default) and English support
- Language preference stored in localStorage
- Use `useI18n()` composable in components for translations

#### 5. Styling Approach
- TailwindCSS with custom color palette in config
- Dark mode via `dark:` prefix (class-based)
- Custom animations defined in `index.css`
- Font Awesome icons via CDN

## Development Notes

### Path Aliases
- `@/` points to `src/` directory (configured in `vite.config.js`)

### Authentication
- Default credentials: `admin` / `123456`
- User data stored in localStorage (no backend)
- Login state persists across sessions

### Data Persistence
- Tasks and user data stored in browser localStorage
- Maximum data size limited by localStorage constraints (~5-10MB)
- No database or file system access in current implementation

### Theme System
- Supports manual dark/light toggle
- Integrates with system theme via Electron IPC
- Theme preference stored in localStorage

### Building for Distribution
- Electron Builder configured for multi-platform builds (Windows, macOS, Linux)
- Production builds include Vite output from `dist/` directory
- App ID: `com.taskmanager.app`
