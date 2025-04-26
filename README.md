# XP Computer Web Application

Welcome to the **XP Computer** Next.js project! This repository contains a fully functional web application with:

- 🔒 Role‑based authentication (Admin & Customer)
- 🎨 Responsive, Tailwind‑CSS UI
- 📊 Informational sections (Owner, Team, Branches, Why Join Us, Testimonials)
- 📱 Sticky side panels and clean layouts
- 📁 Easy image management via the `public/assets/images` folder

---

## Table of Contents

1. [Demo](#demo)
2. [Features](#features)
3. [Tech Stack](#tech-stack)
4. [Getting Started](#getting-started)
5. [Project Structure](#project-structure)
6. [Managing Images](#managing-images)
7. [Authentication Flow](#authentication-flow)
8. [Scripts](#scripts)
9. [Deployment](#deployment)
10. [Contributing](#contributing)
11. [License](#license)

---

## Demo

![Login Page ](./assets/login.png)



---

## Features

- **User Signup & Login** (JWT in HTTP‑only cookies)
- **Role Guarding**: Separate dashboards for `admin` and `customer`
- **Client‑side Redirects**: Prevent back‑button access after logout
- **Informational Sections**: Owner, Manager, Team members, Branches, Why Join Us, Testimonials
- **Footer**: Contact info, quick links, social media icons
- **Mobile‑friendly**: Tailwind CSS grid and responsive utilities

---

## Tech Stack

- **Framework**: Next.js App Router
- **UI**: React, Tailwind CSS
- **State**: React Context API
- **API Requests**: Axios
- **Auth**: JWT with HTTP‑only cookies
- **Database**: MongoDB via Mongoose

---

## Getting Started

### Prerequisites

- Node.js v16+
- npm or Yarn

### Installation

1. **Clone** the repo:
   ```bash
   git clone https://github.com/<your‑username>/xp‑computer.git
   cd xp‑computer
   ```
2. **Install dependencies**:
   ```bash
   npm install
   # or
   yarn install
   ```
3. **Configure environment**:
   - Copy `.env.sample` to `.env.local`
   - Fill in your **MongoDB URI** and **JWT_SECRET**

4. **Run the app**:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

Open `http://localhost:3000` in your browser.

---

## Project Structure

```text
xp‑computer/
├── public/
│   └── assets/
│       └── images/          # Place all images here
│           ├── owner.jpg
│           ├── manager.jpg
│           ├── branch-1.jpg
│           ├── team-1.jpg
│           └── demo-landing.png
├── src/
│   ├── app/
│   │   ├── components/
│   │   ├── api/
│   │   └── context/
│   └── lib/                # Utilities (dbConnect, etc.)
├── .env.local
├── next.config.js
└── README.md
```

---

## Managing Images

All UI images live in the **`public/assets/images`** folder. They are served at `/assets/images/<filename>` in JSX and Markdown.

### Adding New Images

1. Copy or add your image files into `public/assets/images/`.
2. Reference them in code:
   ```jsx
   <img src="/assets/images/your-image.jpg" alt="Description" />
   ```
3. Reference them in Markdown:
   ```md
   ![Alt Text](/assets/images/your-image.jpg)
   ```

### Naming Conventions

- Use **kebab-case** (lowercase + hyphens): `branch-1.jpg`, `team-2.png`, `demo-landing.jpg`.
- Keep names descriptive and avoid spaces.

---

## Authentication Flow

1. **Signup** (`/signup`): Registers user, sets JWT cookie.
2. **Login** (`/login`): Authenticates, sets JWT cookie, redirects based on role.
3. **AuthProvider**: On app load, calls `/api/authentication/admin` to verify JWT and initialize React Context.
4. **Protected Routes**: Each dashboard watches `auth` state and `router.replace` to prevent unauthorized/back navigation.
5. **Logout**: Calls `/api/authentication/logout`, clears cookie, forces redirect and page reload.

---

## Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm start        # Start production server
npm run lint     # Run ESLint
```

---

## Deployment

Deploy to Vercel, Netlify, or your preferred platform. Ensure your environment variables match those in `.env.local`.

---

## Contributing

1. Fork the repo
2. Create a branch: `git checkout -b feature/YourFeature`
3. Commit: `git commit -m "feat: add awesome feature"`
4. Push: `git push origin feature/YourFeature`
5. Open a Pull Request

---

## License

This project is licensed under the [MIT License](LICENSE).

---

❤️  Happy coding! Feel free to open issues or PRs for improvements.

