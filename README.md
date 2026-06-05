# Personal Task Manager

## Project Title & Brief Description

**Exercise 1: Personal Task Manager**

This project is a full-stack Personal Task Manager application built using the MERN stack. It allows users to create, view, update, delete, and manage personal tasks without authentication. Tasks can be filtered by status (All, Active, Completed), marked as complete or incomplete, edited, and deleted with confirmation. The application also displays active/completed task counts, highlights overdue tasks, and provides an empty-state UI when no tasks exist.

---

## Live Demo Links

### Frontend (Netlify)

https://task-manager-studio.netlify.app/

---

## Tech Stack

### Frontend

* React.js – Component-based UI development
* Vite – Fast development server and optimized production builds
* CSS3 – Styling and responsive layout
* Axios – HTTP requests to backend APIs

### Backend

* Node.js – JavaScript runtime environment
* Express.js – REST API development
* MongoDB – NoSQL database for task storage
* Mongoose – MongoDB object modeling and schema management
* dotenv – Environment variable management
* cors – Cross-origin resource sharing support

### Deployment

* Netlify – Frontend hosting
* Render – Backend hosting

---

## Features

* Add a new task with:

  * Required title
  * Optional description
  * Optional due date
* View all tasks sorted by creation date (newest first)
* Edit task details
* Delete task with confirmation prompt
* Toggle task completion status
* Filter tasks by:

  * All
  * Active
  * Completed

* Active vs Completed task counts
* Overdue task highlighting
* Empty state UI when no tasks exist

---

## How to Run Locally

### Prerequisites

Install:

* Node.js
* MongoDB (Local Installation or MongoDB Atlas)

### Clone Repository

```bash
git clone <https://github.com/shivam2046/task_manage>
cd task-manager
```

### Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside the backend folder:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
```

Start the backend server:

```bash
npm start
```

Backend will run on:

```text
http://localhost:5000
```

### Frontend Setup

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend will run on:

```text
http://localhost:5173
```

---

## API Documentation

### Base URL

```text
http://localhost:5000
```

### 1. Get All Tasks

**Method**

```http
GET /api/tasks
```

**Response**

```json
{
  "success": true,
  "count": 2,
  "summary": {
    "active": 1,
    "completed": 1
  },
  "data": []
}
```

---

### 2. Get Active Tasks

**Method**

```http
GET /api/tasks?status=active
```

**Response**

```json
{
  "success": true,
  "data": []
}
```

---

### 3. Get Completed Tasks

**Method**

```http
GET /api/tasks?status=completed
```

**Response**

```json
{
  "success": true,
  "data": []
}
```

---

### 4. Create Task

**Method**

```http
POST /api/tasks
```

**Request Body**

```json
{
  "title": "Complete MERN assignment",
  "description": "Build a personal task manager with full CRUD operations",
  "dueDate": "2025-06-10T00:00:00.000Z"
}
```

**Response**

```json
{
  "success": true,
  "data": {}
}
```

---

### 5. Create Task (Title Only)

**Method**

```http
POST /api/tasks
```

**Request Body**

```json
{
  "title": "Buy groceries"
}
```

---

### 6. Create Task (Without Due Date)

**Method**

```http
POST /api/tasks
```

**Request Body**

```json
{
  "title": "Read clean code book",
  "description": "Finish at least 3 chapters this week"
}
```

---

### 7. Update Task

**Method**

```http
PUT /api/tasks/:id
```

**Request Body**

```json
{
  "title": "Complete MERN assignment (updated)",
  "description": "Backend + Frontend both need to be submitted",
  "dueDate": "2025-06-15T00:00:00.000Z"
}
```

**Response**

```json
{
  "success": true,
  "data": {}
}
```

---

### 8. Update Only Title

**Method**

```http
PUT /api/tasks/:id
```

**Request Body**

```json
{
  "title": "Buy groceries and vegetables"
}
```

---

### 9. Toggle Completion Status

**Method**

```http
PATCH /api/tasks/:id/toggle
```

**Response**

```json
{
  "success": true,
  "data": {}
}
```

---

### 10. Delete Task

**Method**

```http
DELETE /api/tasks/:id
```

**Response**

```json
{
  "success": true,
  "message": "Task deleted successfully"
}
```

---

## Project Structure

```text
task-manager/
│
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   └── taskController.js
│   ├── middleware/
│   │   └── errorHandler.js
│   ├── models/
│   │   └── task.js
│   ├── routes/
│   │   └── taskRoutes.js
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── TaskForm.jsx
│   │   │   ├── TaskItem.jsx
│   │   │   └── TaskList.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

---

## Next Steps

The project currently focuses on core CRUD functionality and task management fundamentals. Future improvements could include:

* User Authentication and Authorization (JWT)
* User-specific Task Ownership
* Task Categories and Priorities
* Search and Sorting Features
* Drag-and-Drop Task Organization
* Dark Mode Support
* Pagination for Large Task Lists

---
