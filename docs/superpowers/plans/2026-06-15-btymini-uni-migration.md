# BTYMini uni-app Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create a new parallel `BTYMini-uni` project that reimplements the food-diary module in uni-app without modifying the legacy Taro project.

**Architecture:** The new project uses uni-app + Vue 3 + Vite with a small set of pure utility modules for records, dates, and image helpers. The first release focuses on the food-diary loop so the new architecture has a complete, testable path before any broader migration.

**Tech Stack:** uni-app, Vue 3, Vite, SCSS, Node.js 20.12.2

---

### Task 1: Scaffold the new project shell

**Files:**
- Create: `package.json`
- Create: `vite.config.js`
- Create: `src/main.js`
- Create: `src/App.vue`
- Create: `src/manifest.json`
- Create: `src/pages.json`
- Create: `src/styles/theme.scss`
- Create: `docs/uni-app-migration.md`
- Create: `docs/superpowers/plans/2026-06-15-btymini-uni-migration.md`

- [ ] **Step 1: Write the project shell files**
- [ ] **Step 2: Verify the config files match uni-app conventions**
- [ ] **Step 3: Commit the scaffold**

### Task 2: Implement pure food-diary utilities

**Files:**
- Create: `src/constants/food-diary.js`
- Create: `src/utils/food-diary/date.js`
- Create: `src/utils/food-diary/storage.js`
- Create: `src/utils/food-diary/image.js`
- Create: `src/utils/food-diary/index.js`
- Create: `src/utils/food-diary/runtime.js`
- Create: `tests/food-diary-utils.test.mjs`

- [ ] **Step 1: Write the failing utility test**
- [ ] **Step 2: Verify the test fails before implementation**
- [ ] **Step 3: Implement the minimal utility functions**
- [ ] **Step 4: Run the test and verify it passes**
- [ ] **Step 5: Commit the utility layer**

### Task 3: Build reusable drink UI components

**Files:**
- Create: `src/components/food-diary/DrinkImagePicker.vue`
- Create: `src/components/food-diary/DrinkRecordCard.vue`

- [ ] **Step 1: Implement the Vue components**
- [ ] **Step 2: Verify props/emits match the pages that consume them**
- [ ] **Step 3: Commit the reusable components**

### Task 4: Recreate the food-diary pages in uni-app

**Files:**
- Create: `src/pages/food-diary/index/index.vue`
- Create: `src/pages/food-diary/add/index.vue`
- Create: `src/pages/food-diary/detail/index.vue`
- Create: `src/pages/food-diary/store/index.vue`

- [ ] **Step 1: Implement the calendar home page**
- [ ] **Step 2: Implement the add/edit page**
- [ ] **Step 3: Implement the detail page**
- [ ] **Step 4: Implement the store picker page**
- [ ] **Step 5: Commit the first working loop**

### Task 5: Verify and document the migration state

**Files:**
- Update: `docs/uni-app-migration.md`
- Update: `README.md` if needed

- [ ] **Step 1: Re-read the docs and check for gaps**
- [ ] **Step 2: Record any known limitations**
- [ ] **Step 3: Report the remaining migration scope**

