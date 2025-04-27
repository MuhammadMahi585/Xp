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
5. [Authentication Flow](#authentication-flow)
6. [Deployment](#deployment)


---

## Demo

## Authentication

# Login Page
![Login Page ](./assets/login.png)

# SignUp Page
![SignUp Page ](./assets/signup.png)

## Admin Functionalities

# Add Product Page
![Add Product Page ](./assets/addProduct.png)

# View Products Page
![View Products Page ](./assets/ViewProducts.png)

# Search Products by Name
![Search Products by Name Page ](./assets/SerachProducr.png)

# Search Products by Category
![Search Products by Category Page ](./assets/SortProducts.png)

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
   cd Xp
   ```
2. **Install dependencies**:
   ```bash
   npm install
   
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




## Authentication Flow

1. **Signup** (`/signup`): Registers user, sets JWT cookie.
2. **Login** (`/login`): Authenticates, sets JWT cookie, redirects based on role.
3. **AuthProvider**: On app load, calls `/api/authentication/admin` to verify JWT and initialize React Context.
4. **Protected Routes**: Each dashboard watches `auth` state and `router.replace` to prevent unauthorized/back navigation.
5. **Logout**: Calls `/api/authentication/logout`, clears cookie, forces redirect and page reload.


```

## Deployment

I will deploy to Vercel

---


