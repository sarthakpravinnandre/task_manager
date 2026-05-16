# TeamHub — Advanced Team Management System

TeamHub is a comprehensive, role-based project management and team collaboration platform built with the latest web technologies. It provides a seamless experience for managing tasks, meetings, messages, and project lifecycles across different organizational roles.

<img width="1918" height="986" alt="image" src="https://github.com/user-attachments/assets/2803514a-7c34-4923-bf1d-409bfa2d8710" />
<img width="1919" height="983" alt="image" src="https://github.com/user-attachments/assets/866ec505-e9a5-4b25-a36e-49ae30332241" />
<img width="1917" height="943" alt="image" src="https://github.com/user-attachments/assets/f84892ca-27db-4b6c-a64e-52b28304a5b4" />
<img width="618" height="445" alt="image" src="https://github.com/user-attachments/assets/061002ff-e6a4-4969-8643-84bb25d18c22" />
<img width="1919" height="949" alt="image" src="https://github.com/user-attachments/assets/10344208-3233-4711-9e98-451ab5e9658e" />






## 🚀 Key Features

- **Role-Based Dashboards**: Tailored experiences for Admins, Senior Managers, Team Leads, Project Leads, and Developers.
- **Task Lifecycle Management**: Comprehensive task tracking from creation to completion, including assignment acceptance and progress updates.
- **Collaboration Suite**: 
  - **Messages**: Real-time team and direct messaging.
  - **Voice Channels**: Dedicated rooms for voice collaboration.
  - **Meetings**: Integrated scheduling and calendar view.
- **Project Tracking**: Timeline views, project status monitoring, and colorful project tagging.
- **Support System**: Built-in ticket management for technical and organizational issues.
- **Modern UI/UX**: Dark-mode first design with glassmorphism, responsive layouts, and smooth micro-animations.

## 🛠 Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Database**: [PostgreSQL](https://www.postgresql.org/) (hosted on [Neon](https://neon.tech/))
- **ORM**: [Prisma 7](https://www.prisma.io/)
- **Authentication**: [Auth.js v5](https://authjs.dev/) (NextAuth)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **State Management**: [SWR](https://swr.vercel.app/) (Client-side fetching)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Components**: [Radix UI](https://www.radix-ui.com/) primitives

## ⚙️ Setup & Installation

### 1. Prerequisites
- Node.js 18+ 
- A PostgreSQL database (Neon recommended)

### 2. Environment Configuration
Copy `.env.example` to `.env` and configure your credentials:
```bash
DATABASE_URL="your_postgresql_url"
AUTH_SECRET="your_nextauth_secret"
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Database Setup
Sync the schema and seed the demo data:
```bash
npm run db:setup
```
*This runs `prisma db push` followed by the canonical seed script.*

### 5. Run Locally
```bash
npm run dev
```
Visit [http://localhost:3000](http://localhost:3000) to see the app.

## 👥 Demo Accounts

The following accounts are created during the seeding process (password123 for all):

| Role            | Email                | Password     | Scope                          |
|-----------------|---------------------|--------------|--------------------------------|
| Admin           | admin@example.com   | password123  | Organization-wide management   |
| Senior Manager  | manager@example.com | password123  | High-level monitoring          |
| Team Lead       | lead@example.com    | password123  | Team-specific management       |
| Project Lead    | project@example.com | password123  | Project-focused leadership     |
| Developer       | dev@example.com     | password123  | Personal tasks & assignments   |
## 📂 Project Structure

- `app/`: Next.js App Router pages and API routes.
- `components/`: Reusable UI components and dashboard widgets.
- `lib/`: Utility functions, Auth configuration, and Prisma client.
- `prisma/`: Database schema and seeding scripts.
- `hooks/`: Custom React hooks for data fetching (SWR).
- `public/`: Static assets.

## 📝 License

This project is licensed under the MIT License.
