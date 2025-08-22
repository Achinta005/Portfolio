# Portfolio Frontend

A modern, responsive, and accessible portfolio built with Next.js (App Router) and Tailwind CSS. It showcases projects, skills, a blog, and a contact workflow with smooth animations and great performance.

## ✨ Features
- **Responsive design**: Mobile-first layout with adaptive grids and typography
- **Animated UI**: Subtle transitions and micro-interactions using Framer Motion / Motion
- **Skills showcase**: Interactive skills grid with detail cards
- **Projects page**: Filterable, responsive project gallery
- **Blog**: Dynamic routes for posts under `app/blog/[slug]`
- **Contact**: Validated form with `react-hook-form`, server integration ready
- **Dark mode toggle**: Persisted theme preference
- **Admin area**: Admin routes under `/admin/*` (guard-ready via middleware)
- **SEO**: `next-sitemap` integration and optimized head tags
- **Analytics**: Vercel Web Analytics integration

## 🧭 App Structure (high-level)
- `app/page.js`: Landing page and sections
- `app/projects/page.js`: Projects grid
- `app/blog/[slug]/page.js`: Blog post page
- `app/contact/page.js`: Contact form and info
- `app/admin/*`: Admin tools (`Notepad`, `Project`, `ContactResponse`)
- `components/*`: UI components (Header, Footer, Hero, Skills, etc.)

## 🧩 Core Components
- `components/Header.js`: Sticky header with navigation and theme toggle
- `components/HeroSection.js`: Hero banner with CTA
- `components/InteractiveSkillsDisplay.js`: Interactive skills grid with expandable details
- `components/ProjectsGrid.js` / `ProjectGridMobile.js`: Responsive projects gallery
- `components/DarkModeToggle.js`: Theme switcher

## ⚙️ Functions and Behaviors
- **Skills detail toggle**: Click to open/close detail cards per skill
- **Form validation**: Client-side validations in contact form
- **Route protection (ready)**: `middleware.js` scoped to `/admin/:path*` (cookie-based guard recommended)
- **Sitemap generation**: Automated on build via `postbuild`

## 🛠 Tech Stack
- **Framework**: Next.js 15, React 19
- **Styling**: Tailwind CSS 4, Tailwind plugins, Material Tailwind (selective components)
- **Animations**: Framer Motion / Motion
- **Forms**: React Hook Form
- **3D/Graphics (optional)**: Three.js, @react-three/fiber (can be disabled if not needed)
- **SEO**: next-sitemap
- **Analytics**: @vercel/analytics

## 📦 NPM Modules Used
Dependencies:
- `next@15.4.1`, `react@19.1.0`, `react-dom@19.1.0`
- `tailwindcss@^4`, `@tailwindcss/postcss@^4`, `tailwind-merge`, `tailwindcss-animated`, `tailwindcss-motion`
- `framer-motion@^12.23.12`, `motion@^12.23.12`
- `@vercel/analytics@^1.5.0`
- `@material-tailwind/react@^2.1.10`, `@material-tailwind/html@^3.0.0-beta.7`
- `@heroicons/react@^2.2.0`, `@tabler/icons-react@^3.34.1`, `lucide-react@^0.525.0`, `react-icons@^5.5.0`
- `react-hook-form@^7.60.0`
- `next-sitemap@^4.2.3`
- `reactflow@^11.11.4`, `swiper@^11.2.10`
- `three@^0.179.1`, `@react-three/fiber@^9.3.0`, `@types/three@^0.179.0`
- `clsx@^2.1.1`, `qss@^3.0.0`, `js-cookie@^3.0.5`, `jwt-decode@^4.0.0`

DevDependencies:
- `eslint@^9`, `eslint-config-next@15.4.1`, `@eslint/eslintrc@^3`


## 📜 Available Scripts
- `dev`: Start development server
- `build`: Production build
- `start`: Start production server
- `lint`: Run ESLint
- `postbuild`: Generate sitemap via `next-sitemap`
- `vercel-build`: Install (legacy peer deps) + build (for Vercel)

## 🔐 Admin Route Guard (optional)
`middleware.js` is currently pass-through. To protect `/admin/*`, set an auth cookie (e.g., `auth_token`) and check it in middleware to redirect unauthenticated users to `/login`.
---
