# SyncBoard

SyncBoard is a real-time collaborative web application built with React, TypeScript, Node.js, and WebSockets. Changes made by one connected client are synchronized across all other connected clients without requiring a page refresh.

## Features

- Create and delete cards on a shared board
- Real-time synchronization across multiple browser clients
- Persistent bidirectional WebSocket connections
- Server-side shared state and broadcasting
- Connection status indicator

## Tech Stack

- React
- TypeScript
- Node.js
- WebSockets (`ws`)
- Vite

## How It Works

Each browser establishes a WebSocket connection with the Node.js server.

When a user creates or deletes a card, the client sends a message to the server. The server updates its in-memory board state and broadcasts the updated state to every connected client.

This allows multiple users to see board changes immediately without refreshing the page.

## Running Locally

### Server

```bash
cd server
npm install
node server.js
```

### Client

Open another terminal:

```bash
cd client
npm install
npm run dev
```

Then open the local URL provided by Vite in multiple browser windows to test real-time synchronization.

## Current Limitations

Board state is currently stored in memory, so it resets when the server restarts. Persistent storage is a planned future improvement.