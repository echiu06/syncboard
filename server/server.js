const WebSocket = require("ws");

const wss = new WebSocket.Server({ port: 8080 });

let cards = [];

function broadcast() {
  const message = JSON.stringify({
    type: "CARDS",
    cards,
  });

  for (const client of wss.clients) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  }
}

wss.on("connection", (socket) => {
  console.log("Client connected");

  // Give a newly connected user the current board.
  socket.send(
    JSON.stringify({
      type: "CARDS",
      cards,
    })
  );

  socket.on("message", (data) => {
    const message = JSON.parse(data.toString());

    if (message.type === "ADD_CARD") {
      cards.push(message.card);
      broadcast();
    }

    if (message.type === "DELETE_CARD") {
      cards = cards.filter((card) => card.id !== message.id);
      broadcast();
    }
  });

  socket.on("close", () => {
    console.log("Client disconnected");
  });
});

console.log("SyncBoard WebSocket server running on ws://localhost:8080");