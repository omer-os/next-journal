# 📝 Product Requirements Document (PRD) – Next Journal

## Overview

**Next Journal** is a minimalist, offline-first journaling app designed for personal daily use. The app helps capture daily reflections, track progress, and access previous entries—all with a smooth user experience and no need for an internet connection. AI-powered features like summarization and chatting with your journal become available when online.

---

## Goals

- Enable fast and distraction-free journal entry
- Fully functional offline (read/write/edit)
- Simple, smooth UI that feels like a native app
- AI-powered summaries and chatbot features when online
- No login or cloud — all data stored locally

---

## Tech Stack

- **Next.js** – Fullstack React framework
- **Tailwind CSS** – Styling
- **Framer Motion** – Smooth animations and page transitions
- **Lucide React** – Icons
- **TypeScript** – Full type safety via `utils/types.d.ts`
- **LocalStorage** – Local database for storing journal data
- **PWA** – [ducanh-next-pwa](https://ducanh-next-pwa.vercel.app/) for offline capability
- **Vercel AI SDK** – Handles communication with Claude AI models
- **Claude 3.5 (Haiku)** – For summarization and chat features

---

## Entry Format

```ts
{
  id: string; // Unique ID
  text: string; // Full journal content
  createdAt: string; // ISO timestamp of creation
  updatedAt?: string; // Last updated time (optional)
  images: string[]; // Cached image paths
  summary?: string; // AI-generated summary (optional)
}
