# Polling App

A modern, real-time polling application built with Next.js 15, Supabase, and Tailwind CSS. This application allows users to create, participate in, and manage polls with a focus on ease of use and professional design.

## 🚀 Features

- **Authentication**: Secure user authentication using Supabase Auth (Sign up, Log in).
- **Dashboard**: A personalized dashboard for users to view and manage their polls.
- **Poll Management**: Create, edit, and delete polls with multiple options.
- **Voting System**: Simple and intuitive voting interface.
- **Admin Panel**: Dedicated administrative interface for higher-level management.
- **Responsive Design**: Optimized for both desktop and mobile devices.
- **Real-time Updates**: (Powered by Supabase) seamless data synchronization.

## 🛠 Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Database & Auth**: [Supabase](https://supabase.com/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **UI Components**: [Radix UI](https://www.radix-ui.com/)
- **Icons**: [Lucide React](https://lucide.dev/)

## 🏁 Getting Started

### Prerequisites

- Node.js 20+ installed
- A Supabase project created

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd pollingapp
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory and add your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📁 Project Structure

- `src/app/`: Next.js App Router pages and API routes.
- `src/components/`: Reusable UI components (Admin, Dashboard, Polls, UI).
- `src/hooks/`: Custom React hooks.
- `src/lib/`: Shared utility functions and third-party library configurations.
- `src/utils/`: General-purpose helper functions.

## 📄 License

This project is licensed under the MIT License.
