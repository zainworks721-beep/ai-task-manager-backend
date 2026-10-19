# 📋 Task Manager REST API with Groq AI Integration

A production-ready, modular RESTful API built with **Node.js**, **Express.js**, **MongoDB (Mongoose)**, and integrated with the ultra-fast **Groq AI API** for automated, intelligent task planning and breakdown.

---

## 🌟 Features

- **Full Task CRUD**: Create, read, update, and delete tasks with comprehensive input validation.
- **AI Task Assistant**: Seamlessly integrated with Groq Cloud (Llama 3.3 / Llama 3) to generate structured breakdown plans, priority ratings, estimated hours, and actionable steps.
- **Robust Error Handling**: Centralized error middleware handling Mongoose validation errors, invalid ObjectIDs (CastError), duplicate keys, and AI service failures.
- **Production-Ready Architecture**: Clean separation of concerns (Controllers, Models, Routes, Config, and Middleware).
- **Postman Collection Included**: Complete Postman Collection v2.1 with automated variable assignment and test cases.

---

## 📁 Project Structure

```text
task-manager-api/
├── src/
│   ├── config/
│   │   └── db.js               # MongoDB connection and connection event listeners
│   ├── controllers/
│   │   ├── task.controller.js  # CRUD controller logic
│   │   └── ai.controller.js    # Groq AI plan generator controller
│   ├── models/
│   │   └── task.model.js       # Mongoose Task schema and model
│   ├── routes/
│   │   ├── task.routes.js      # REST routes for tasks
│   │   └── ai.routes.js        # AI assistant routes
│   ├── middleware/
│   │   └── errorHandler.js     # 404 handler and global error handler
│   └── app.js                  # Express application setup, middlewares, and route mounting
├── .env.example                # Example environment variable template
├── server.js                   # Server initialization and graceful shutdown handling
├── package.json                # Project dependencies and npm scripts
├── README.md                   # Complete documentation and deployment guide
└── postman_collection.json     # Postman collection for manual and automated testing
```

---

## 🛠️ Tech Stack & Dependencies

- **Runtime**: Node.js (v18+ recommended)
- **Framework**: Express.js
- **Database**: MongoDB (Atlas or local) with Mongoose ORM
- **AI Provider**: [Groq Cloud](https://groq.com) via `groq-sdk`
- **Utilities**: `dotenv` (Environment configuration), `cors` (CORS headers), `morgan` (HTTP request logging)
- **Dev Tools**: `nodemon` (Hot reloading)

---

## 🚀 Getting Started Locally

### 1. Prerequisites
- **Node.js** (v18.x or later) installed on your machine. Check with `node -v`.
- A **MongoDB Atlas** account or a local MongoDB instance running.
- A **Groq Cloud API Key** (Free tier available at [console.groq.com](https://console.groq.com/keys)).

### 2. Installation
Clone or navigate to the project directory and install all dependencies:

```bash
cd task-manager-api
npm install
```

### 3. Environment Variables Setup
Create a `.env` file in the root directory by copying the provided `.env.example`:

```bash
cp .env.example .env
```

Open `.env` and fill in your values:

```env
PORT=5000
NODE_ENV=development

# MongoDB Atlas connection string
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/task_manager?retryWrites=true&w=majority

# Your Groq API key from https://console.groq.com/keys
GROQ_API_KEY=gsk_your_groq_api_key_here

# Optional: customize the Groq model (defaults to llama-3.3-70b-versatile)
GROQ_MODEL=llama-3.3-70b-versatile
```

### 4. Running the Server

#### Development Mode (with hot-reload):
```bash
npm run dev
```

#### Production Mode:
```bash
npm start
```

Once running, the server will log:
```text
✅ MongoDB Connected: cluster0.mongodb.net/task_manager
🚀 Server listening on port 5000 in development mode
📡 Base URL: http://localhost:5000
🩺 Health check: http://localhost:5000/api/health
```

---

## 📡 API Endpoints Reference

### Health Check
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Returns server health status |

---

### Task Endpoints (`/api/tasks`)

#### 1. Create a Task
- **URL**: `POST /api/tasks`
- **Body**:
  ```json
  {
    "title": "Set up CI/CD pipeline",
    "description": "Configure GitHub Actions workflow for automated testing and deployment.",
    "status": "pending",
    "dueDate": "2026-11-15T00:00:00.000Z"
  }
  ```
- **Response** (`201 Created`):
  ```json
  {
    "success": true,
    "message": "Task created successfully",
    "data": {
      "_id": "660c1d76e4b0123456789abc",
      "title": "Set up CI/CD pipeline",
      "description": "Configure GitHub Actions workflow for automated testing and deployment.",
      "status": "pending",
      "dueDate": "2026-11-15T00:00:00.000Z",
      "createdAt": "2026-10-18T16:00:00.000Z",
      "updatedAt": "2026-10-18T16:00:00.000Z"
    }
  }
  ```

#### 2. Get All Tasks
- **URL**: `GET /api/tasks`
- **Optional Query**: `?status=pending` (`pending`, `in-progress`, `completed`)
- **Response** (`200 OK`):
  ```json
  {
    "success": true,
    "count": 1,
    "data": [
      {
        "_id": "660c1d76e4b0123456789abc",
        "title": "Set up CI/CD pipeline",
        "description": "Configure GitHub Actions workflow...",
        "status": "pending",
        "dueDate": "2026-11-15T00:00:00.000Z",
        "createdAt": "2026-10-18T16:00:00.000Z",
        "updatedAt": "2026-10-18T16:00:00.000Z"
      }
    ]
  }
  ```

#### 3. Get Task by ID
- **URL**: `GET /api/tasks/:id`
- **Response** (`200 OK`):
  ```json
  {
    "success": true,
    "data": {
      "_id": "660c1d76e4b0123456789abc",
      "title": "Set up CI/CD pipeline",
      "status": "pending"
    }
  }
  ```
- **Invalid ID Response** (`400 Bad Request`):
  ```json
  {
    "success": false,
    "message": "Invalid Task ID format: '12345'"
  }
  ```
- **Not Found Response** (`404 Not Found`):
  ```json
  {
    "success": false,
    "message": "Task not found with id of '660c1d76e4b0123456789abc'"
  }
  ```

#### 4. Update Task
- **URL**: `PUT /api/tasks/:id`
- **Body**: Any subset of `title`, `description`, `status`, `dueDate`
  ```json
  {
    "status": "in-progress"
  }
  ```
- **Response** (`200 OK`):
  ```json
  {
    "success": true,
    "message": "Task updated successfully",
    "data": {
      "_id": "660c1d76e4b0123456789abc",
      "status": "in-progress"
    }
  }
  ```

#### 5. Delete Task
- **URL**: `DELETE /api/tasks/:id`
- **Response** (`200 OK`):
  ```json
  {
    "success": true,
    "message": "Task deleted successfully",
    "data": {}
  }
  ```

---

### AI Task Assistant (`/api/ai`)

#### Generate AI Task Plan
- **URL**: `POST /api/ai/plan-task`
- **Body**:
  ```json
  {
    "description": "Migrate monolithic database to microservices architecture with minimal downtime"
  }
  ```
- **Response** (`200 OK`):
  ```json
  {
    "success": true,
    "plan": {
      "summary": "Database migration from monolith to microservices with zero downtime",
      "priority": "high",
      "estimatedHours": 16,
      "steps": [
        "Audit existing monolithic database tables and map domain boundaries",
        "Implement Change Data Capture (CDC) or double-write strategy",
        "Set up target microservice database instances and replicate historical data",
        "Run parity validation scripts across both databases",
        "Gradually switch read traffic, followed by write traffic, using feature flags",
        "Decommission deprecated tables after verification period"
      ]
    }
  }
  ```
- **Missing Description** (`400 Bad Request`):
  ```json
  {
    "success": false,
    "message": "Task description is required and cannot be empty."
  }
  ```

---

## 📬 Postman Collection Setup

1. Open Postman.
2. Click **Import** in the top left.
3. Select the `postman_collection.json` file located in the root of this project.
4. The collection is configured with collection variables:
   - `baseUrl`: default is `http://localhost:5000/api`
   - `taskId`: auto-captured when you execute `Create Task (Success)`.
5. You can now execute and test all endpoints with a single click.

---

## 🌐 Deploying to Render (Step-by-Step)

[Render](https://render.com) provides free and affordable hosting for Node.js web services. Follow these steps to deploy this API to Render:

### Step 1: Push Code to GitHub / GitLab
1. Initialize a git repository if not already done:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Task Manager REST API with Groq AI"
   ```
2. Create a new repository on [GitHub](https://github.com/new).
3. Push your repository:
   ```bash
   git remote add origin https://github.com/<your-username>/task-manager-api.git
   git branch -M main
   git push -u origin main
   ```

### Step 2: Configure MongoDB Atlas Network Access
Render assigns dynamic IP addresses to web services on the free/starter tiers.
1. Log in to [MongoDB Atlas](https://cloud.mongodb.com).
2. Go to **Network Access** under Security.
3. Click **Add IP Address**.
4. Choose **Allow Access from Anywhere** (`0.0.0.0/0`) and click **Confirm**.
5. Ensure your database user credentials (username and password) are active under **Database Access**.

### Step 3: Create a Web Service on Render
1. Log in to your [Render Dashboard](https://dashboard.render.com).
2. Click **New +** and select **Web Service**.
3. Choose **Build and deploy from a Git repository** and connect your GitHub/GitLab account.
4. Select your `task-manager-api` repository.

### Step 4: Configure Service Settings
Fill in the following fields in the Render dashboard:

- **Name**: `task-manager-api` (or any unique name)
- **Region**: Choose the region closest to you or your MongoDB cluster (e.g., Frankfurt, Oregon, Singapore)
- **Branch**: `main`
- **Root Directory**: Leave blank (root of repository)
- **Runtime**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Instance Type**: `Free`

### Step 5: Configure Environment Variables on Render
Scroll down to the **Environment Variables** section and add the following keys:

| Key | Value | Notes |
| :--- | :--- | :--- |
| `NODE_ENV` | `production` | Enables production optimizations |
| `PORT` | `10000` | (Render sets PORT automatically, but 10000 or leaving server.js `process.env.PORT` works seamlessly) |
| `MONGO_URI` | `mongodb+srv://<user>:<password>@cluster0.mongodb.net/task_manager?retryWrites=true&w=majority` | Your actual MongoDB Atlas URI |
| `GROQ_API_KEY` | `gsk_...` | Your Groq Cloud API key |

### Step 6: Deploy & Verify
1. Click **Create Web Service**.
2. Render will trigger the build:
   - Clones repo
   - Runs `npm install`
   - Executes `npm start`
3. Look at the logs for:
   ```text
   ✅ MongoDB Connected: ...
   🚀 Server listening on port 10000 in production mode
   ```
4. Copy your live Render URL (e.g. `https://task-manager-api-xxxx.onrender.com`).
5. Test the health check endpoint:
   ```bash
   curl https://task-manager-api-xxxx.onrender.com/api/health
   ```
6. In Postman, update the `baseUrl` collection variable to `https://task-manager-api-xxxx.onrender.com/api` to test your live deployed API!

---

## 🔒 Security & Best Practices Implemented

- **CORS Configured**: Cross-origin requests handled cleanly for frontend integrations.
- **Strict Error Handling**: Internal server errors do not leak stack traces in production (`process.env.NODE_ENV === 'production'`).
- **Mongoose Sanitization**: Parameter validation protects against invalid query injection.
- **Graceful Shutdown**: Intercepts `SIGINT` and `SIGTERM` signals to cleanly terminate database connections and HTTP server instances.
- **Groq JSON Mode & Sanitization**: Enforces strict JSON schemas with fallback regex parsing.

---

## 📄 License
This project is open-source and available under the [ISC License](LICENSE).
