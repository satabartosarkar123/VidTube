# VidTube Backend

This is a Node.js backend server built with Express. It provides a foundation for handling HTTP requests, connecting to a MongoDB database, and serving as the backend for a video platform.

---

## Overview

- **Express** is used to create the server and define routes.
- **MongoDB** is used as the database.
- **Middleware** like CORS and body parsers are used for security and data handling.
- **Controllers** handle the logic for each route.
- **Utilities** help with error handling and formatting API responses.

---

## Project Structure & Functionality

| File/Folder                        | Purpose                                                                 |
|------------------------------------|-------------------------------------------------------------------------|
| `app.js`                           | Sets up the Express app, middleware, and routes                         |
| `index.js`                         | Loads environment variables, connects to MongoDB, starts the server     |
| `db/index.js`                      | Connects to MongoDB                                                     |
| `constants.js`                     | Stores constants (like the database name)                               |
| `routes/healthCheck.routes.js`     | Defines health check endpoints                                          |
| `controllers/healthcheckController.js` | Handles logic for health check routes                              |
| `utils/apiResponse.js`             | Formats API responses                                                   |
| `utils/asyncHandler.js`            | Handles errors in async functions                                       |
| `utils/ApiError.js`                | Custom error class for API errors                                       |
| `.env`                             | Stores environment variables                                            |

---

### Key Components

#### 1. `app.js`
- Creates the Express app.
- Sets up middleware:
  - `cors`: Allows requests from specified origins.
  - `express.json()`: Parses incoming JSON data.
  - `express.urlencoded()`: Parses URL-encoded data.
  - `express.static("public")`: Serves static files from the `public` folder.
- Imports and uses routes, such as `/api/v1/healthcheck`.

#### 2. `index.js`
- Loads environment variables from `.env`.
- Connects to MongoDB using `connectDB()`.
- Starts the server on the specified port.
- Defines a root route (`/`) that returns a simple message.

#### 3. `db/index.js`
- Defines `connectDB()` to connect to MongoDB using the URL from `.env`.
- Logs success or errors.

#### 4. `constants.js`
- Exports constants like `DB_NAME` for use throughout the project.

#### 5. `routes/healthCheck.routes.js`
- Defines health check routes:
  - `/` and `/test` both use the `healthCheck` controller.
- Exports the router for use in `app.js`.

#### 6. `controllers/healthcheckController.js`
- Defines the `healthCheck` controller:
  - Uses `asyncHandler` to handle errors.
  - Returns a JSON response `{ status: "test ok" }` using the `apiResponse` class.

#### 7. `utils/apiResponse.js`
- Defines the `apiResponse` class to format API responses with a status code, data, and message.

#### 8. `utils/asyncHandler.js`
- Defines `asyncHandler()` to wrap async route handlers and catch errors.

#### 9. `utils/ApiError.js`
- Defines the `ApiError` class for custom API errors.

#### 10. `.env`
- Stores environment variables such as:
  - `PORT`: The port your server runs on.
  - `CORS_ORIGIN`: Which URLs can access your backend.
  - `MONGO_URI`: Your MongoDB connection string.

---

## How a Request Flows

1. **Client sends a request** (e.g., GET `/api/v1/healthcheck`).
2. **Express receives it** in `app.js`.
3. **Route matches** `/api/v1/healthcheck` and calls the `healthCheck` controller.
4. **Controller runs logic** and sends a response using `apiResponse`.
5. **Middleware** (like `cors` and `express.json()`) runs automatically on every request.

---

## Summary

This backend project is structured for clarity and scalability. It separates concerns into different files and folders, making it easy to add new features, handle errors, and maintain the codebase.

---