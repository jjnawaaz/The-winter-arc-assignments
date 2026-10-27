# The Winter Arc Assignments — Backend Assignment

> Part of **The-winter-arc-assignments** collection.
>
> **Assignment:** Backend Assignment — Task & Workspace Management API

A backend assignment completed as part of **The Winter Arc**. This project demonstrates a RESTful API for authentication, workspace management, task CRUD operations, validation, and dashboard statistics.

---

## Project Overview

Built with **Node.js, Express, PostgreSQL, and Zod**, the API provides JWT-based authentication and lets authenticated users organize tasks inside their own workspaces. It includes task and workspace operations, request validation, task search and pagination, due dates, and a dashboard summary.

## Features

### Authentication
- User signup and signin.
- Password hashing with `bcrypt`.
- JWT-based authentication.
- Protected routes require a bearer token.
- Duplicate usernames are handled with a conflict response.

### Workspaces
- Create a workspace.
- List the authenticated user's workspaces.
- Delete a workspace owned by the authenticated user.
- Workspace ownership is checked using the authenticated user's ID.

### Tasks
- Create, list, update, and delete tasks.
- Associate each task with a workspace.
- Store a task due date.
- Update task completion status.
- Search task titles and descriptions.
- Paginate task lists with `page` and `limit` query parameters.
- Restrict task access to workspaces owned by the authenticated user.

### Dashboard
- Return the number of workspaces owned by the user.
- Return total, completed, and pending task counts.

### Validation and data integrity
- Validate request bodies with **Zod**.
- Validate due dates using the ISO date format (`YYYY-MM-DD`) and reject past dates during task creation.
- Use parameterized SQL queries to pass values safely to PostgreSQL.
- Return appropriate HTTP status codes for successful operations and common errors.

## Tech Stack

- **Runtime:** Node.js
- **Server:** Express
- **Database:** PostgreSQL
- **Database client:** `pg`
- **Validation:** Zod
- **Authentication:** JSON Web Tokens (`jsonwebtoken`)
- **Password security:** `bcrypt`
- **Environment variables:** `dotenv`
- **Cross-origin requests:** `cors`

## Project Structure

```text
.
├── controllers/
│   ├── authController.js
│   ├── workspaceController.js
│   ├── taskController.js
│   └── dashboardController.js
├── middleware/
│   └── authMiddleware.js
├── routes/
│   ├── authRoutes.js
│   ├── workspaceRoutes.js
│   ├── taskRoutes.js
│   └── dashboardRoute.js
├── types/
│   └── types.js
├── utils/
│   ├── jwtUtils.js
│   └── bcryptUtils.js
├── .env
├── .env.example
├── .gitignore
├── index.js
├── package.json
└── index.js
```

The database connection/setup is defined at the project root in `index.js`. The `types/types.js` file contains the project's shared zod schemas.

## Database Schema

The API uses three related tables: `users`, `workspaces`, and `tasks`.

A schema matching the implemented data model is:

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username TEXT UNIQUE,
  password TEXT
);

CREATE TABLE workspaces (
  id SERIAL PRIMARY KEY,
  name TEXT,
  user_id INTEGER REFERENCES users(id)
);

CREATE TABLE tasks (
  id SERIAL PRIMARY KEY,
  title TEXT,
  description TEXT,
  completed BOOLEAN,
  workspace_id INTEGER REFERENCES workspaces(id),
  due_date DATE
);
```

If the tables already exist, apply the due-date migration if it has not been run:

```sql
ALTER TABLE tasks ADD COLUMN due_date DATE;
```

Run schema creation and migrations against your development database before starting the API. If your repository includes migration files, use those rather than running the SQL manually.

## Getting Started

### Prerequisites

- Node.js and npm
- PostgreSQL
- A database created for this application

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd <repository-directory>
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root:

```env
PORT=3000
DB_URL=postgresql://<username>:<password>@localhost:5432/<database_name>
JWT_SECRET=<use-a-long-random-secret>
```

Replace the placeholders with your local PostgreSQL credentials and a strong, private JWT secret. Do not commit `.env` or real credentials to version control.

### 4. Prepare the database

Create the tables shown in the **Database Schema** section, or run the project's migrations if it has them.

### 5. Start the server

Use the start script defined in `package.json`. For example, if the project defines a `dev` script:

```bash
npm run dev
```

Or, if it defines a `start` script:

```bash
npm start
```

The server uses `PORT` from the environment and defaults to port `3000` if it is not set.

## API Reference

Unless otherwise stated, protected endpoints require:

```http
Authorization: Bearer <JWT_TOKEN>
```

Task endpoints also use a `workspaceId` request header to identify the workspace being accessed:

```http
workspaceId: Integer(id)
```

HTTP header names are case-insensitive. In Node.js, access this header using the lowercase key:

```js
req.headers.workspaceid
```

The examples below assume the routes are mounted as `/user`, `/workspace`, `/task`, and `/`. If your route mounting differs, adjust the paths to match your server.

### Authentication

| Method | Endpoint | Auth required | Purpose |
|---|---|---:|---|
| `POST` | `/user/signup` | No | Register a user |
| `POST` | `/user/signin` | No | Sign in and receive a JWT |

**Signup request**

```json
{
  "username": "jane",
  "password": "secure-password"
}
```

**Signin request**

```json
{
  "username": "jane",
  "password": "secure-password"
}
```

Use the token returned by signin as a bearer token on protected requests.

### Workspaces

| Method | Endpoint | Auth required | Purpose |
|---|---|---:|---|
| `POST` | `/workspace/create` | Yes | Create a workspace |
| `GET` | `/workspace/get-all-workspaces` | Yes | List the current user's workspaces |
| `DELETE` | `/workspace/delete-workspace/:id` | Yes | Delete an owned workspace |

**Create workspace request**

```json
{
  "name": "Learning"
}
```

### Tasks

| Method | Endpoint | Auth required | Required workspace header | Purpose |
|---|---|---:|---:|---|
| `POST` | `/task/create` | Yes | `workspaceId` | Create a task |
| `GET` | `/task/task` | Yes | `workspaceId` | List tasks |
| `PATCH` | `/task/task/:taskId` | Yes | `workspaceId` | Update completion status |
| `DELETE` | `/task/task/:taskId` | Yes | `workspaceId` | Delete a task |

**Create task request**

```json
{
  "title": "Learn PostgreSQL",
  "description": "Review queries and relational database fundamentals",
  "dueDate": "2026-11-25"
}
```

Dates must use the ISO format `YYYY-MM-DD`. For example, use `2026-11-25`, not `25-11-2026`.

**List tasks with pagination and search**

```http
GET /task/task?page=1&limit=10&search=postgres
```

- `page`: page number (starts at `1`).
- `limit`: number of records per page (the implementation caps this at `100`).
- `search`: optional case-insensitive search across task titles and descriptions.

Include the `workspaceId` header and bearer token with the request.

**Update task request**

```json
{
  "completed": true
}
```

The update endpoint changes the task's completion status.

### Dashboard

| Method | Endpoint | Auth required | Purpose |
|---|---|---:|---|
| `GET` | `/dashboard` | Yes | Retrieve workspace and task statistics |

The response includes the total number of workspaces, total tasks, completed tasks, and pending tasks for the authenticated user.

## Testing with Postman

1. Start the server and open your Postman collection.
2. Call `POST /user/signup` to create a user.
3. Call `POST /user/signin` and copy the returned JWT.
4. For protected endpoints, add `Authorization: Bearer <JWT_TOKEN>`.
5. Create a workspace using `POST /workspace/create`.
6. Copy the workspace ID from the response.
7. For task endpoints, add the `workspaceId` header with that ID as its value.
8. Create, list, update, and delete tasks. Try pagination and search on the task-list endpoint.
9. Call `GET /dashboard` to verify the counts.

Example protected-request headers:

```http
Authorization: Bearer <JWT_TOKEN>
workspaceId: 7
Content-Type: application/json
```

## Error Handling

The API uses HTTP status codes to communicate request outcomes. Depending on the endpoint and failure, clients may receive responses such as:

- `201 Created` — a user, workspace, or task was created.
- `200 OK` — a request completed successfully.
- `400 Bad Request` — request data failed validation.
- `401 Unauthorized` — authentication is missing or invalid, or credentials are incorrect.
- `404 Not Found` — the requested task or resource was not found within the applicable scope.
- `409 Conflict` — a username already exists.

The exact response body depends on the endpoint.

## Implementation Notes

- Passwords are hashed before being stored; plaintext passwords should never be persisted.
- JWTs identify the authenticated user, and protected operations use that identity rather than accepting a user ID from the request body.
- Task operations are scoped to a workspace and its owner to prevent users from accessing another user's tasks.
- SQL values are passed through PostgreSQL query parameters rather than concatenated into SQL strings.
- Zod schemas validate incoming signup, signin, workspace, and task data.

## Author

**Junaid Nawaz**

