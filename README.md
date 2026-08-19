# Smart Task Manager

A robust Full Stack Task Management System built using the MERN stack (MongoDB, Express, React, Node.js). 
This application provides users with a complete solution for creating, managing, tracking, and analyzing their tasks securely.

## Features
- **User Authentication**: Secure JWT-based login and registration system.
- **Task Management**: Create, Read, Update, and Delete tasks.
- **Filtering & Search**: Instantly find tasks by title, filter by status (Todo, In Progress, Done) or priority (Low, Medium, High).
- **Analytics Dashboard**: Real-time insights showing total tasks, completion rates, and pending counts.
- **Modern UI**: Highly aesthetic responsive design utilizing custom CSS variables, dark mode toggles, and glassmorphism.

## Architecture & Design Decisions
- **Frontend Framework**: React using Vite for ultra-fast Hot Module Replacement (HMR) and optimized builds.
- **Styling**: Vanilla CSS to enforce lightweight, highly customizable styling without heavy utility classes. Designed with "Glassmorphism" for a premium feel.
- **Backend Framework**: Node.js and Express.js, organized into a standard Controller/Route/Model structure.
- **Database**: MongoDB (via Mongoose).
- **Security**: Passwords hashed using `bcryptjs`. API routes protected using JSON Web Tokens.

APP IMAGES:
<img width="1904" height="805" alt="image" src="https://github.com/user-attachments/assets/78f0b9f9-206e-4158-a478-b197d8b4837c" />
<img width="1880" height="813" alt="image" src="https://github.com/user-attachments/assets/afda3533-3b10-4e39-b342-7d25e6a4d113" />


## Local Setup Instructions

### 1. Clone the repository
```bash
git clone https://github.com/ABHAY-AVA2005/Smart-Task-Manager.git
cd Smart-Task-Manager
```

### 2. Backend Setup
Navigate to the backend directory, install dependencies, and configure environment variables.
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` folder:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/taskmanager # Or your MongoDB Atlas URI
JWT_SECRET=your_secret_key_here
```
Run the backend:
```bash
npm run dev
```

### 3. Frontend Setup
Navigate to the frontend directory and install dependencies.
```bash
cd ../frontend
npm install
```
Run the frontend:
```bash
npm run dev
```
The application will be available at `http://localhost:5173`.

## API Endpoints

### Auth Endpoints
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Authenticate user & get token

### Task Endpoints (Requires Bearer Token)
- `POST /api/tasks` - Create a task
- `GET /api/tasks` - Get all tasks (supports `?search`, `?status`, `?priority`, `?sortBy` query params)
- `PUT /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task
- `GET /api/tasks/analytics` - Get user task statistics
