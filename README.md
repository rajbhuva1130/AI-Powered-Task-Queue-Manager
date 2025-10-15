# AI-Powered-Task-Queue-Manager

The **AI-Powered Task Queue Manager** is a robust, full-stack web application designed for personal task management, combining a high-performance FastAPI backend with a modern React frontend. It features a scalable architecture utilizing Celery and Redis for handling long-running or resource-intensive tasks asynchronously, ensuring a smooth and responsive user experience.

## 🚀 Features
  * **User Authentication:** Secure registration, login, and profile management using JWT (JSON Web Tokens) for authentication.
  * **Profile Management:** Users can view, update their details (name, username, email, mobile), and securely change their password.
  * **Full CRUD Task Management:** Create, Read, Update (edit and status change), and Delete user-specific jobs/tasks.
  * **Asynchronous Task Processing:** Utilizes Celery to queue and execute background jobs such as simulated AI text processing, long-running tasks, and progress tracking.
  * **Interactive Dashboard:** Provides a visual overview of task status distribution (TODO, IN PROGRESS, DONE) using a Recharts Pie Chart.
  * **Modern UI:** Built with React and styled using Tailwind CSS for a responsive and clean design.

## 🛠️ Technology Stack
| Component | Technology | Role |
| :--- | :--- | :--- |
| **Backend API** | **FastAPI (Python)** | High-performance, asynchronous API framework. |
| **Database** | **PostgreSQL** | Primary relational data store. |
| **ORM** | **SQLAlchemy** | Python SQL Toolkit and Object Relational Mapper. |
| **Task Queue** | **Celery** | Distributed task queue for asynchronous job processing. |
| **Message Broker** | **Redis** | Used as the message broker for Celery. |
| **Frontend** | **React & Vite** | Modern JavaScript library for building the user interface. |
| **Styling** | **Tailwind CSS** | Utility-first CSS framework for rapid styling. |
| **Routing** | **React Router DOM** | Handles declarative routing and navigation. |

## 📦 Getting Started with Docker

The easiest way to set up and run the entire stack (FastAPI, Celery Worker, PostgreSQL, Redis) is using Docker Compose.

### Prerequisites

  * Docker
  * Docker Compose

### Installation and Setup

1.  **Clone the Repository:**

    ```bash
    git clone https://github.com/rajbhuva1130/AI-Powered-Task-Queue-Manager
    cd AI-Powered-Task-Queue-Manager
    ```

2.  **Build and Run Services:**
    Use the provided `docker-compose.yml` to start all services in detached mode. This file orchestrates the backend, worker, database, and Redis.

    ```bash
    docker-compose up --build -d
    ```

    *The `backend` service is set to run on port `5000` (mapped from the container's internal port `5000` defined in the `Dockerfile`).*

3.  **Start the Frontend:**
    The frontend is a standard React/Vite application. Navigate to the `frontend` directory and run:

    ```bash
    cd frontend
    npm install
    npm run dev
    ```

    The frontend will typically run on `http://localhost:5173`. It is configured to communicate with the FastAPI backend at `http://127.0.0.1:8000` for its API calls.

4.  **Access the Application:**
    Open your browser and navigate to the frontend URL (e.g., `http://localhost:5173`).

### Stopping Services

To stop all running services and remove containers, networks, and volumes:

```bash
docker-compose down -v
```

## 🖥️ Backend API Reference

The FastAPI backend exposes two main routers:

| Route Prefix | Purpose | Key Endpoints |
| :--- | :--- | :--- |
| `/auth` | User Authentication and Profile Management | `/register`, `/login`, `/update-profile`, `/change-password`. |
| `/jobs` | Task (Job) Management and Queueing | `POST /`, `GET /`, `PUT /{job_id}`, `DELETE /{job_id}`, `PUT /{job_id}/status`. |

-----

## Images
<img width="1916" height="912" alt="Screenshot 2025-10-15 154809" src="https://github.com/user-attachments/assets/71272343-8235-4fd5-ba77-78e5368ebb81" />

-----

<img width="1919" height="913" alt="Screenshot 2025-10-15 154822" src="https://github.com/user-attachments/assets/56492288-9f6c-4ef3-9dec-5088d84763c2" />

-----

<img width="1904" height="910" alt="Screenshot 2025-10-15 155001" src="https://github.com/user-attachments/assets/fa1c9573-2aa7-4cfe-b2df-cf134c28d01b" />

-----

<img width="620" height="350" alt="Screenshot 2025-10-15 155140" src="https://github.com/user-attachments/assets/3e8f58ab-73f6-441f-985f-34355a6e4179" />

-----
