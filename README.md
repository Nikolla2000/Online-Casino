<div align="center">

# 🎰 Elite Casino

**A production-grade full-stack casino platform built to demonstrate senior-level engineering from system design to real-time infrastructure.**

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248?logo=mongodb&logoColor=white)
![Redis](https://img.shields.io/badge/Cache-Redis-DC382D?logo=redis&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Containerized-2496ED?logo=docker&logoColor=white)
![WebSockets](https://img.shields.io/badge/Real--time-WebSockets-purple)

[🎮 Live Demo](https://elite-casino.netlify.app/) · [📖 API Docs (Swagger)](https://online-casino.onrender.com/server/docs/)

</div>

---

> Elite Casino is not just a typical tutorial project, but a full-stack web application featuring live casino games, real-time communication, AI-powered assistance, Google OAuth, versioned REST APIs, Redis caching, and a CI/CD pipeline, all built with the architecture decisions and code quality you'd expect from a professional engineering team.

> [!WARNING]
> **This is NOT a real gambling site and I'm strongly against gambling.** This project serves purely as a technical sandbox to demonstrate my technical skills and explore new technologies. A casino platform was chosen as the domain because it naturally demands complex logic, real-time systems, and a wide range of technical challenges, nothing more.

## ✨ Features

### 🔐 Authentication & Authorization
- Secure **JWT-based** authentication with protected routes
- **Google OAuth 2.0** sign-in for frictionless onboarding
- Guest access with limited functionality across the platform

### 📊 Dashboard
- Personal stats — total credits wagered, total wins, total rounds played, favorite game
- Recent activity feed and full game history
- Personal info display (name, country) and **VIP benefits** panel

### 🎮 Games
- Two fully interactive casino games — **Slots** and **Roulette**
- Each game features custom logic, dynamic UI and persistent history

### 👥 Social & User Interaction
- **Live users panel** displaying currently online players
- View other users' profiles, send direct messages or block them

### 💬 Real-time Communication
- **Private messaging** between users powered by WebSockets
- Fully live — no page refresh needed, instant delivery

### 🤖 AI Chatbot Assistant
- Integrated live chatbot powered by **Groq AI** (`openai/gpt-4o-mini` model)
- Provides casino tips, game guidance and general site assistance
- Different experience for guests vs authenticated users

### 📧 Contact & Notifications
- Contact form with **email delivery** via Nodemailer
- Toast notifications and real-time UI feedback throughout the app

### 🎨 UI & UX
- Fully **responsive** across all screen sizes
- Smooth **animations**, **skeleton loaders** and intuitive navigation
