# Kaste Brands & Designs - Backend Server

This directory contains the Node.js backend for the Kaste Brands & Designs website. It serves the site's content from a MongoDB database and provides real-time updates using WebSockets (Socket.IO).

## Features

-   **Express API**: Serves website content via a REST API.
-   **MongoDB Integration**: Persists all site content using Mongoose.
-   **Real-Time Updates**: Uses Socket.IO to push content changes to all connected clients instantly.
-   **Environment-based Configuration**: Uses `.env` file for easy configuration.

## Local Setup

1.  **Prerequisites**:
    *   [Node.js](https://nodejs.org/) (v16 or later)
    *   [MongoDB](https://www.mongodb.com/try/download/community) installed locally, or a free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) account.

2.  **Install Dependencies**:
    Navigate to this `server` directory in your terminal and run:
    ```bash
    npm install
    ```

3.  **Create Environment File**:
    Create a file named `.env` in this directory and add your MongoDB connection string:
    ```
    # .env
    MONGODB_URI=your_mongodb_connection_string
    PORT=3001
    ```
    *Replace `your_mongodb_connection_string` with your actual MongoDB URI.*

4.  **Run the Server**:
    For development with auto-restarting (requires `nodemon`):
    ```bash
    npm run dev
    ```
    For a standard start:
    ```bash
    npm start
    ```
    The server should now be running, typically on `http://localhost:3001`.

## Deployment

This server is designed to be deployed on any service that supports Node.js applications, such as Render, Heroku, or Fly.io.

### Deploying to Render (Recommended)

Render offers a simple deployment process and a generous free tier.

1.  **Sign up**: Create an account on [Render.com](https://render.com/).
2.  **Create a New Web Service**:
    *   From your dashboard, click "New +" and select "Web Service".
    *   Connect your GitHub/GitLab repository.
3.  **Configuration**:
    *   **Name**: Give your service a name (e.g., `kaste-brands-api`).
    *   **Root Directory**: Set this to `server`. This tells Render to only look inside this directory.
    *   **Environment**: Select `Node`.
    *   **Build Command**: `npm install`
    *   **Start Command**: `npm start`
4.  **Add Environment Variables**:
    *   Go to the "Environment" tab for your new service.
    *   Add a variable with the key `MONGODB_URI` and the value of your MongoDB Atlas connection string.
    *   Render sets the `PORT` variable automatically, so you don't need to add it.
5.  **Deploy**:
    *   Click "Create Web Service". Render will automatically build and deploy your server.

Once deployed, Render will provide you with a public URL for your API (e.g., `https://kaste-brands-api.onrender.com`). You will use this URL to configure your frontend on Netlify.
