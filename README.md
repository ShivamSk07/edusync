# EdSync — Offline-First Personalized Learning Platform

EdSync is a modern, offline-first educational platform engineered by developers to empower students with uninterrupted learning regardless of internet connectivity.

## ✨ Core Features

- **Offline-First Architecture:** Complete IndexedDB local cache for textbooks, study materials, notes, and progress.
- **AI Study Buddy:** Hybrid AI assistant delivering step-by-step academic explanations, formula breakdowns, and practice quiz questions.
- **Personalized Syllabus:** Strict board and state curriculum alignment (CBSE, ICSE, State Boards).
- **Career Navigator:** Skill trees, project roadmaps, and higher-study options across STEM, Commerce, and Humanities.
- **Progress Analytics:** Interactive charts for weekly study time, streaks, and syllabus mastery.
- **Verified Opportunities:** Up-to-date scholarships, fellowships, and internships sourced directly from official government portals.
- **Mentorship Hub:** 1-on-1 guidance request system connecting students with experienced educators and researchers.

## 🛠️ Tech Stack

- **Framework:** TanStack Start / React 19 / TypeScript
- **Styling:** Tailwind CSS (v4) with custom academic design system
- **Routing:** TanStack Router (File-based routing)
- **State & Cache:** TanStack React Query + IndexedDB (`idb`)
- **Visuals & Charts:** Recharts + Lucide Icons
- **AI Integration:** Hybrid EdSync AI Engine (Adaptive Academic Assistant) + Offline Knowledge Base Fallback

## 🚀 Getting Started

Follow these steps to run EdSync locally:

### 1. Clone & Enter Project Directory
```bash
# Clone the repository
git clone https://github.com/ShivamSk07/edusync.git

# IMPORTANT: Always navigate into the repository folder before running npm commands
cd edusync
```

### 2. Environment Configuration
```bash
# Copy example environment variables
cp .env.example .env.local
# On Windows Command Prompt:
# copy .env.example .env.local
```

### 3. Install Dependencies & Start
```bash
# Install all packages
npm install

# Start local development server
npm run dev

# Build for production
npm run build
```

## 🔄 Updating to Latest Version

If you have already cloned the repository and want to get the latest updates:

```bash
# Fetch latest commits
git pull origin main

# Install any updated dependencies
npm install

# Restart the dev server
npm run dev
```

---
*Built with ❤️ by Developers for Students everywhere.*
