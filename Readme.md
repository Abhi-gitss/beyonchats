# BeyondChats Technical Assignment

##  Project Overview
This monolithic repository contains a full-stack solution for the Technical Product Manager assignment. It automatically aggregates blog content, enhances it using AI/Scraping, and presents it via a modern UI.

**Architecture:**
- **Backend:** Laravel 11 (API & Database Management)
- **Database:** MySQL
- **Processor:** Node.js (Handles Google Search, Scraping, and AI Simulation)
- **Frontend:** React + Vite + Bootstrap

## Flow Diagram
[User] -> [React Frontend] -> [Laravel API] <-> [MySQL DB]
                                     ^
                                     |
                           [Node.js Processor]
                               /    |    \
                          (Search) (Scrape) (AI Rewrite)

## 🛠️ Setup Instructions

### 1. Backend (Laravel)
```bash
cd backend
composer install
cp .env.example .env  # Configure DB credentials
php artisan key:generate
php artisan migrate
php artisan scrape:articles  # Initial data fetch
php artisan serve

NODE.JS(PROCESSOR)
cd processor
npm install
node index.js  # Runs the background enhancement process

FRONTEND(REACT0)
cd frontend
npm install
npm run dev