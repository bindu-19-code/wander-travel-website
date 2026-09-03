import { useState } from "react";

function AIAssistant() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Hi! I'm your AI travel assistant. Where would you like to go?",
    },
  ]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!message.trim() || loading) return;

    const userMessage = message;

    setMessages((previousMessages) => [
      ...previousMessages,
      {
        role: "user",
        text: userMessage,
      },
    ]);

    setMessage("");
    setLoading(true);

    try {
      const response = await fetch("https://wander-backend-z7kf.onrender.com/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage,
        }),
      });

      const data = await response.json();
      console.log("AI RESPONSE:", data);

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      let parsedReply = data.reply;

      try {
        parsedReply = JSON.parse(data.reply);
      } catch (error) {
        // Normal text response
      }

      setMessages((previousMessages) => [
        ...previousMessages,
        parsedReply?.type === "itinerary"
          ? {
              role: "assistant",
              itinerary: parsedReply,
            }
          : {
              role: "assistant",
              text: data.reply,
            },
      ]);
    } catch (error) {
      console.error(error);

      setMessages((previousMessages) => [
        ...previousMessages,
        {
          role: "assistant",
          text: "Sorry, I couldn't connect to the travel assistant.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="assistant" className="assistant-section">
      <p className="eyebrow">YOUR TRAVEL COMPANION</p>

      <div className="section-heading">
        <h2>
          Ask your
          <br />
          travel assistant.
        </h2>

        <p>
          Get ideas, recommendations, and travel planning help.
        </p>
      </div>

      <div className="chat-container">
        <div className="chat-messages">
            {messages.map((item, index) => (
            <div
                key={index}
                className={`chat-message ${item.role}`}
            >
                {item.itinerary ? (
                <div className="itinerary">
                    <h3>{item.itinerary.destination} Itinerary</h3>

                    {item.itinerary.days.map((day) => (
                    <div className="itinerary-day" key={day.day}>
                        <h4>
                        Day {day.day} — {day.title}
                        </h4>

                        <p>
                        <strong>🌅 Morning:</strong> {day.morning}
                        </p>
                        <br/>
                        <p>
                        <strong>☀️ Afternoon:</strong> {day.afternoon}
                        </p>
                        <br/>
                        <p>
                        <strong>🌙 Evening:</strong> {day.evening}
                        </p>
                    </div>
                    ))}
                </div>
                ) : (
                <p>{item.text}</p>
                )}
            </div>
            ))}
          {loading && (
            <div className="chat-message assistant">
              <p>Thinking...</p>
            </div>
          )}
        </div>

        <div className="chat-input">
          <input
            type="text"
            placeholder="Ask me anything about travel..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                sendMessage();
              }
            }}
          />

          <button onClick={sendMessage} disabled={loading}>
            {loading ? "..." : "Send →"}
          </button>
        </div>
      </div>
    </section>
  );
}

export default AIAssistant;