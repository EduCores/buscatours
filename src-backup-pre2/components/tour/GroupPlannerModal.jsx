import React from "react";
import * as Icons from "lucide-react";

export default function GroupPlannerModal({
  showGroupPlanner, setShowGroupPlanner,
  tour, copiedLink, setCopiedLink, plannerVotes, setPlannerVotes,
  date, plannerChats, setPlannerChats, plannerChatMsg, setPlannerChatMsg
}) {
  if (!showGroupPlanner) return null;

  return (
    <div style={{
      position: "fixed", top: 0, right: 0, width: "100%", maxWidth: "420px", height: "100%",
      backgroundColor: "var(--bg-surface)", borderLeft: "1px solid var(--border-color)",
      boxShadow: "-10px 0 30px rgba(0,0,0,0.4)", zIndex: 1500, display: "flex", flexDirection: "column",
      fontFamily: "var(--font-body)", color: "var(--text-main)"
    }}>
      {/* Header */}
      <div style={{ padding: "24px", borderBottom: "1px solid var(--border-color)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h3 style={{ fontSize: "1.15rem", fontWeight: 800, color: "var(--text-heading)", display: "flex", alignItems: "center", gap: "8px", margin: 0 }}>
          <Icons.Users style={{ color: "var(--primary)" }} /> Planificador Grupal BuscaTours
        </h3>
        <button onClick={() => setShowGroupPlanner(false)} style={{ background: "transparent", border: "none", color: "var(--text-muted)", cursor: "pointer" }}>
          <Icons.X size={20} />
        </button>
      </div>

      {/* Content */}
      <div style={{ flexGrow: 1, padding: "24px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "20px" }}>

        {/* Invite link share */}
        <div style={{ backgroundColor: "rgba(0,0,0,0.02)", padding: "16px", borderRadius: "8px", border: "1px solid var(--border-color)" }}>
          <label style={{ fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", color: "var(--text-muted)", display: "block", marginBottom: "6px" }}>
            Enlace para Compartir con Amigos
          </label>
          <div style={{ display: "flex", gap: "8px" }}>
            <input
              type="text"
              readOnly
              value={`http://localhost:5173/#tour/${tour.id}?grp=736358`}
              style={{ flex: 1, padding: "6px 10px", border: "1px solid var(--border-color)", borderRadius: "4px", fontSize: "0.75rem", backgroundColor: "rgba(0,0,0,0.01)", color: "var(--text-muted)", outline: "none" }}
            />
            <button
              onClick={() => {
                setCopiedLink(true);
                setTimeout(() => setCopiedLink(false), 2000);
              }}
              style={{ padding: "6px 12px", border: "none", backgroundColor: "var(--primary)", color: "#fff", borderRadius: "4px", fontSize: "0.75rem", fontWeight: 700, cursor: "pointer" }}
            >
              {copiedLink ? "Copiado" : "Copiar"}
            </button>
          </div>
        </div>

        {/* Live voting */}
        <div>
          <h4 style={{ fontSize: "0.85rem", fontWeight: 800, color: "var(--text-heading)", marginBottom: "10px" }}>Preferencias de Fecha del Grupo</h4>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {plannerVotes.map((v, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 12px", border: "1px solid var(--border-color)", borderRadius: "6px", backgroundColor: "var(--bg-surface)", fontSize: "0.8rem" }}>
                <span>👤 <strong>{v.name}</strong></span>
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{v.date}</span>
                <span style={{ fontSize: "0.75rem", fontWeight: 700, color: v.status.includes("Confirmado") ? "#22c55e" : "var(--primary)" }}>{v.status}</span>
              </div>
            ))}
          </div>
          <button
            onClick={() => {
              if (plannerVotes.some((x) => x.name.includes("Tú"))) return;
              setPlannerVotes([...plannerVotes, { name: "Tú (Organizador)", date: date || "Por definir", status: "Confirmado 👍" }]);
            }}
            className="btn btn-outline"
            style={{ width: "100%", padding: "8px", fontSize: "0.78rem", marginTop: "10px" }}
          >
            Votar por mi Fecha Seleccionada
          </button>
        </div>

        {/* Chat section */}
        <div>
          <h4 style={{ fontSize: "0.85rem", fontWeight: 800, color: "var(--text-heading)", marginBottom: "10px" }}>Chat del Grupo</h4>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", maxHeight: "180px", overflowY: "auto", padding: "10px", border: "1px solid var(--border-color)", borderRadius: "6px", backgroundColor: "rgba(0,0,0,0.01)" }}>
            {plannerChats.map((c, i) => (
              <div key={i} style={{ display: "flex", flexDirection: "column", gap: "2px", alignSelf: c.sender === "Tú" ? "flex-end" : "flex-start", maxWidth: "80%" }}>
                <span style={{ fontSize: "0.68rem", color: "var(--text-muted)", alignSelf: c.sender === "Tú" ? "flex-end" : "flex-start" }}>{c.sender} • {c.time}</span>
                <div style={{ padding: "8px 12px", borderRadius: "12px", fontSize: "0.78rem", backgroundColor: c.sender === "Tú" ? "var(--primary)" : "var(--bg-surface)", color: c.sender === "Tú" ? "#fff" : "var(--text-main)", border: c.sender === "Tú" ? "none" : "1px solid var(--border-color)" }}>
                  {c.text}
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", gap: "8px", marginTop: "10px" }}>
            <input
              type="text"
              placeholder="Escribe un mensaje al grupo..."
              value={plannerChatMsg}
              onChange={(e) => setPlannerChatMsg(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && plannerChatMsg.trim()) {
                  setPlannerChats([...plannerChats, { sender: "Tú", text: plannerChatMsg, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
                  setPlannerChatMsg("");
                }
              }}
              style={{ flex: 1, padding: "8px 12px", border: "1px solid var(--border-color)", borderRadius: "6px", fontSize: "0.78rem", backgroundColor: "var(--bg-surface)", color: "var(--text-main)", outline: "none" }}
            />
            <button
              onClick={() => {
                if (!plannerChatMsg.trim()) return;
                setPlannerChats([...plannerChats, { sender: "Tú", text: plannerChatMsg, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
                setPlannerChatMsg("");
              }}
              style={{ border: "none", backgroundColor: "var(--primary)", color: "#fff", borderRadius: "6px", padding: "8px 12px", cursor: "pointer" }}
            >
              Enviar
            </button>
          </div>
        </div>

      </div>

      {/* Footer actions */}
      <div style={{ padding: "20px 24px", borderTop: "1px solid var(--border-color)", display: "flex", gap: "10px" }}>
        <button
          onClick={() => {
            alert("Itinerario compartido guardado. Todos los miembros recibirán notificaciones.");
            setShowGroupPlanner(false);
          }}
          className="btn btn-primary"
          style={{ flex: 1, padding: "10px", fontSize: "0.85rem" }}
        >
          Confirmar Itinerario Grupal
        </button>
      </div>
    </div>
  );
}
