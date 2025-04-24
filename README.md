# 📝 AI Notes App

An AI-powered notes app built with **Next.js**, **TypeScript**, **TailwindCSS**, **Supabase**, **Shadcn/UI**, and **React Query**. This app allows users to create, manage, and summarize their notes using AI — with full authentication and user activity tracking.

---

## 🚀 Features

- 🔐 **Authentication**
  - Sign up / Sign in via **email** (with email confirmation)
  - Sign in with **Google**

- 🗒️ **Notes**
  - Create, edit, view, and delete notes
  - AI-generated **summary** of the content with one click
  - Auto-generate a **title** if the user doesn't provide one

- 👤 **User Profile**
  - View and update personal details
  - See activity stats:
    - Total notes
    - Notes with AI summary
    - Last active time

---

## 📦 Tech Stack

- [Next.js (App Router)](https://nextjs.org)
- [Supabase](https://supabase.com) (Auth + Database + Storage)
- [TailwindCSS](https://tailwindcss.com)
- [Shadcn UI](https://ui.shadcn.com/)
- [React Query](https://tanstack.com/query)
- [Zod + React Hook Form](https://react-hook-form.com)
- AI Summarization using ChatGPT API

---


## Getting Started

### 1. Clone the Repository

```bash
git clone git@github.com:nandanpathakk/Note-Task-App.git
cd Note-Task-App
```

### 2. Install Dependencies
```bash
npm install
# or
pnpm install
# or
yarn
```

### Create .env.local file
```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
OPENAI_API_KEY=your_openAI_API_key
```

###4. Run the Development Server
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
