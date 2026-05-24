# GigFlow - Smart Leads Dashboard

A full-stack Lead Management Dashboard using the MERN stack with clean architecture, scalable code practices, and a professional user experience.

## Features
- **Authentication**: JWT-based user login & registration with Role-Based Access Control (Admin, Sales User).
- **Leads Management**: Full CRUD operations for leads.
- **Advanced Filtering**: Filter by Status, Source, search by Name/Email, and sort by date.
- **Pagination**: Backend paginated list of leads.
- **CSV Export**: Export filtered leads data to CSV.
- **Dark Mode**: Toggleable dark mode UI.
- **Dockerized**: Easy setup using Docker Compose.

## Tech Stack
- **Frontend**: React 18 (Vite), TypeScript, TailwindCSS, React Router, Axios, React Hook Form, Zod.
- **Backend**: Node.js, Express, TypeScript, MongoDB (Mongoose), JWT, bcryptjs.

## Setup Instructions

### Using Docker (Recommended)
1. Ensure Docker and Docker Compose are installed.
2. Clone the repository.
3. Run `docker-compose up --build`.
4. Access the frontend at `http://localhost:5173` and the backend at `http://localhost:5000`.

### Local Setup
1. Clone the repository.
2. Go to `/backend`, run `npm install`, add a `.env` file (see `.env.example`), and run `npm run dev`. Ensure a MongoDB instance is running.
3. Go to `/frontend`, run `npm install`, add a `.env` file, and run `npm run dev`.
