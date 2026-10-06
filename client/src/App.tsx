import { useEffect, useRef, useState } from "react";
import "./App.css";

type Card = {
  id: number;
  text: string;
};

function App() {
  const [cards, setCards] = useState<Card[]>([]);
  const [text, setText] = useState("");
  const [connected, setConnected] = useState(false);
  const socket = useRef<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080");
    socket.current = ws;

    ws.onopen = () => setConnected(true);
    ws.onclose = () => setConnected(false);

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);

      if (message.type === "CARDS") {
        setCards(message.cards);
      }
    };

    return () => ws.close();
  }, []);

  function addCard() {
    if (!text.trim() || !socket.current) return;

    socket.current.send(
      JSON.stringify({
        type: "ADD_CARD",
        card: {
          id: Date.now(),
          text: text.trim(),
        },
      })
    );

    setText("");
  }

  function deleteCard(id: number) {
    socket.current?.send(
      JSON.stringify({
        type: "DELETE_CARD",
        id,
      })
    );
  }

  return (
    <div className="app">
      <header>
        <div>
          <h1>SyncBoard</h1>
          <p>Real-time collaborative workspace</p>
        </div>

        <span className="status">
          {connected ? "● Connected" : "● Disconnected"}
        </span>
      </header>

      <main>
        <div className="add-card">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addCard()}
            placeholder="Add something to the board..."
          />
          <button onClick={addCard}>Add</button>
        </div>

        <div className="board">
          {cards.length === 0 ? (
            <div className="empty">
              <h2>Your board is empty</h2>
              <p>Add a card to get started.</p>
            </div>
          ) : (
            cards.map((card) => (
              <div className="card" key={card.id}>
                <p>{card.text}</p>
                <button
                  className="delete"
                  onClick={() => deleteCard(card.id)}
                >
                  Delete
                </button>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}

export default App;