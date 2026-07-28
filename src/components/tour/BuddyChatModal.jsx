import React from "react";
import { X } from "lucide-react";

export default function BuddyChatModal({
  selectedBuddyChat, setSelectedBuddyChat, buddyChats, chatInput, setChatInput, handleSendBuddyMessage
}) {
  if (!selectedBuddyChat) return null;

  return (
    <div
      className="reel-modal-container"
      onClick={() => setSelectedBuddyChat(null)}
      style={{ zIndex: 1001 }}
    >
      <div
        className="glass-card modal"
        style={{
          width: "100%",
          maxWidth: "400px",
          borderRadius: "var(--radius-md)",
          overflow: "hidden",
          animation: "scale-up-fade 0.3s cubic-bezier(0.16, 1, 0.3, 1)"
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", borderBottom: "1px solid var(--border-color)", backgroundColor: "rgba(0,0,0,0.02)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <strong style={{ color: "var(--text-heading)", fontSize: "0.95rem" }}>💬 Chat con {selectedBuddyChat}</strong>
          </div>
          <button
            onClick={() => setSelectedBuddyChat(null)}
            style={{ background: "none", border: "none", color: "var(--text-heading)", cursor: "pointer" }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Chat Messages */}
        <div style={{ height: "260px", overflowY: "auto", padding: "20px", display: "flex", flexDirection: "column", gap: "12px" }}>
          {buddyChats.map((chat, idx) => {
            const isMe = chat.sender === "Tú";
            return (
              <div
                key={idx}
                style={{
                  alignSelf: isMe ? "flex-end" : "flex-start",
                  backgroundColor: isMe ? "var(--primary)" : "rgba(0,0,0,0.03)",
                  color: isMe ? "var(--text-inverse)" : "var(--text-main)",
                  padding: "8px 12px",
                  borderRadius: "12px",
                  borderTopRightRadius: isMe ? "0" : "12px",
                  borderTopLeftRadius: isMe ? "12px" : "0",
                  maxWidth: "80%",
                  fontSize: "0.8rem",
                  boxShadow: "var(--shadow-sm)"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", fontSize: "0.65rem", opacity: 0.7, marginBottom: "2px" }}>
                  <strong>{chat.sender}</strong>
                  <span>{chat.time}</span>
                </div>
                <span>{chat.text}</span>
              </div>
            );
          })}
        </div>

        {/* Input Form */}
        <form onSubmit={handleSendBuddyMessage} style={{ padding: "16px", borderTop: "1px solid var(--border-color)", display: "flex", gap: "10px", backgroundColor: "rgba(0,0,0,0.01)" }}>
          <input
            type="text"
            placeholder="Escribe tu mensaje..."
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            style={{
              flex: 1,
              padding: "8px 12px",
              border: "1px solid var(--border-color)",
              borderRadius: "6px",
              fontSize: "0.8rem",
              backgroundColor: "var(--bg-surface)",
              color: "var(--text-main)",
              outline: "none"
            }}
          />
          <button
            type="submit"
            style={{
              border: "none",
              backgroundColor: "var(--primary)",
              color: "var(--text-inverse)",
              padding: "8px 16px",
              borderRadius: "6px",
              fontSize: "0.8rem",
              fontWeight: 700,
              cursor: "pointer"
            }}
          >
            Enviar
          </button>
        </form>
      </div>
    </div>
  );
}
