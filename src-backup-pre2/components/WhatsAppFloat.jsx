import { useState, useEffect, useRef } from "react";
import { X, Send, Globe, ArrowRight } from "lucide-react";
import { useTranslation } from "../i18n/LanguageContext";

export default function WhatsAppFloat() {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      text: "Hello! Welcome to Busca Tours support.", 
      sender: "agent",
      translatedText: "¡Hola! Bienvenido al soporte de Busca Tours.",
      lang: "EN",
      targetLang: "ES"
    },
    { 
      id: 2, 
      text: "How can I help you explore Latin America today?", 
      sender: "agent",
      translatedText: "¿Cómo puedo ayudarte a explorar Latinoamérica hoy?",
      lang: "EN",
      targetLang: "ES"
    }
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Suggested multi-lingual inputs
  const predefinedQuestions = [
    { text: "Is the weather guarantee free?", lang: "EN" },
    { text: "Can I pay in local currency?", lang: "EN" },
    { text: "Do you have guides in Calafate?", lang: "EN" }
  ];

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping]);

  const handleSendMessage = (textToSend) => {
    if (!textToSend.trim()) return;

    // Detect language: simple heuristic (if it has common english words, treat as EN, translate to ES)
    const isEnglish = /[a-zA-Z]/.test(textToSend) && (
      textToSend.toLowerCase().includes("weather") || 
      textToSend.toLowerCase().includes("free") || 
      textToSend.toLowerCase().includes("pay") || 
      textToSend.toLowerCase().includes("currency") || 
      textToSend.toLowerCase().includes("guide") ||
      textToSend.toLowerCase().includes("is") ||
      textToSend.toLowerCase().includes("how") ||
      textToSend.toLowerCase().includes("do") ||
      textToSend.toLowerCase().includes("have")
    );

    let userTranslation = "";
    if (isEnglish) {
      const lower = textToSend.toLowerCase();
      if (lower.includes("weather")) {
        userTranslation = "¿La garantía de clima es gratuita?";
      } else if (lower.includes("pay") || lower.includes("currency")) {
        userTranslation = "¿Puedo pagar en moneda local?";
      } else if (lower.includes("guide") || lower.includes("calafate")) {
        userTranslation = "¿Tienen guías en El Calafate?";
      } else {
        userTranslation = "Traducción al Español: " + textToSend;
      }
    }

    const userMsg = { 
      id: messages.length + 1, 
      text: textToSend, 
      sender: "user",
      translatedText: isEnglish ? userTranslation : null,
      lang: isEnglish ? "EN" : "ES",
      targetLang: isEnglish ? "ES" : null
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      let replyText = "";
      let replyTranslation = "";

      const lower = textToSend.toLowerCase();

      if (lower.includes("weather") || lower.includes("clima")) {
        replyText = "Sí, la Garantía Climática Paramétrica está incluida de forma 100% gratuita en todos nuestros tours reservados en el portal.";
        replyTranslation = "Yes, the Parametric Weather Guarantee is included 100% free on all tours booked on the portal.";
      } else if (lower.includes("pay") || lower.includes("currency") || lower.includes("pagar") || lower.includes("moneda")) {
        replyText = "Para operadores de LATAM, cobramos mediante MercadoPago en pesos locales o en cuotas. Para extranjeros, procesamos vía Stripe en USD.";
        replyTranslation = "For LATAM operators, we charge via MercadoPago in local pesos or installments. For foreigners, we process via Stripe in USD.";
      } else if (lower.includes("guide") || lower.includes("guías") || lower.includes("calafate")) {
        replyText = "¡Por supuesto! En El Calafate contamos con nuestro staff de guías expertos (como Juan Pérez y Carlos Rossi) asignados a excursiones de glaciar.";
        replyTranslation = "Of course! In El Calafate we have our staff of expert guides (like Juan Pérez and Carlos Rossi) assigned to glacier excursions.";
      } else {
        replyText = "Recibido. Traduciremos tu mensaje al operador local para darte una cotización del viaje de inmediato.";
        replyTranslation = "Received. We will translate your message to the local operator to give you a travel quote immediately.";
      }

      setMessages((prev) => [...prev, { 
        id: prev.length + 1, 
        text: replyText, 
        sender: "agent",
        translatedText: replyTranslation,
        lang: "ES",
        targetLang: "EN"
      }]);
    }, 1500);
  };

  return (
    <div style={{ position: "fixed", bottom: "30px", right: "30px", zIndex: 1000, fontFamily: "var(--font-body)" }}>
      {/* Floating pulsing button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          style={{
            width: "60px",
            height: "60px",
            borderRadius: "50%",
            backgroundColor: "#0081de87",
            border: "none",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            boxShadow: "0 8px 30px rgba(234, 179, 8, 0.3)",
            position: "relative"
          }}
          title={t("waBilingualSupport", "Soporte Bilingüe Traducido")}
        >
          <Globe size={28} />
          {/* Pulsing indicator */}
          <span
            style={{
              position: "absolute",
              top: "-2px",
              right: "-2px",
              width: "12px",
              height: "12px",
              borderRadius: "50%",
              backgroundColor: "#22c55e",
              border: "2px solid #fff"
            }}
          />
        </button>
      )}

      {/* Chat bubble overlay */}
      {isOpen && (
        <div
          className="glass-card"
          style={{
            width: "calc(100vw - 60px)",
            maxWidth: "360px",
            height: "500px",
            borderRadius: "var(--radius-md)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            boxShadow: "var(--shadow-lg)",
            border: "1px solid var(--border-color)",
            backgroundColor: "var(--bg-surface)",
            animation: "slide-up-fade 0.3s cubic-bezier(0.16, 1, 0.3, 1)"
          }}
        >
          {/* Chat Header */}
          <div
            style={{
              background: "linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)",
              color: "#fff",
              padding: "16px 20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{ position: "relative" }}>
                <div style={{ width: "40px", height: "40px", borderRadius: "50%", backgroundColor: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Globe size={20} style={{ color: "#fff" }} />
                </div>
                <span
                  style={{
                    position: "absolute",
                    bottom: 0,
                    right: 0,
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    backgroundColor: "#22c55e",
                    border: "2px solid var(--primary)"
                  }}
                />
              </div>
              <div>
                 <h4 style={{ fontSize: "0.9rem", fontWeight: 800, margin: 0, color: "#fff" }}>{t("waAssistant", "Asistente Traductivo")}</h4>
                 <span style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.85)" }}>{t("waAutoTranslationActive", "Traducción Automática B2B2C Activa")}</span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              style={{ background: "transparent", border: "none", color: "#fff", cursor: "pointer" }}
            >
              <X size={20} />
            </button>
          </div>

          {/* Banner notification */}
          <div style={{ padding: "8px 16px", backgroundColor: "rgba(16, 185, 129, 0.08)", borderBottom: "1px solid var(--border-color)", fontSize: "0.72rem", color: "#10b981", display: "flex", alignItems: "center", gap: "6px", fontWeight: 700 }}>
             <span>{t("waBreakingBarrier", "🌐 Rompiendo la barrera lingüística entre turistas y operadores de LATAM.")}</span>
          </div>

          {/* Chat Messages Log */}
          <div
            style={{
              flexGrow: 1,
              padding: "16px",
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              gap: "14px",
              backgroundColor: "rgba(0,0,0,0.015)"
            }}
          >
            {messages.map((m) => {
              const isAgent = m.sender === "agent";
              return (
                <div
                  key={m.id}
                  style={{
                    alignSelf: isAgent ? "flex-start" : "flex-end",
                    maxWidth: "85%",
                    display: "flex",
                    flexDirection: "column",
                    gap: "4px"
                  }}
                >
                  <div
                    style={{
                      backgroundColor: isAgent ? "var(--bg-main)" : "var(--primary)",
                      color: isAgent ? "var(--text-main)" : "#fff",
                      padding: "10px 14px",
                      borderRadius: isAgent ? "0px 12px 12px 12px" : "12px 12px 0px 12px",
                      fontSize: "0.82rem",
                      lineHeight: "1.4",
                      boxShadow: "var(--shadow-sm)",
                      border: isAgent ? "1px solid var(--border-color)" : "none"
                    }}
                  >
                    {m.text}
                  </div>
                  
                  {/* Translation Pill */}
                  {m.translatedText && (
                    <div style={{
                      alignSelf: isAgent ? "flex-start" : "flex-end",
                      fontSize: "0.72rem",
                      color: isAgent ? "var(--text-muted)" : "var(--primary)",
                      backgroundColor: isAgent ? "rgba(0,0,0,0.03)" : "rgba(234, 179, 8, 0.08)",
                      padding: "4px 8px",
                      borderRadius: "6px",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                      border: "1px dashed var(--border-color)",
                      maxWidth: "100%",
                      lineHeight: "1.3"
                    }}>
                      <Globe size={10} />
                      <span>{m.translatedText}</span>
                    </div>
                  )}
                </div>
              );
            })}

            {isTyping && (
              <div
                style={{
                  alignSelf: "flex-start",
                  backgroundColor: "var(--bg-main)",
                  padding: "10px 14px",
                  borderRadius: "0px 12px 12px 12px",
                  border: "1px solid var(--border-color)",
                  display: "flex",
                  gap: "4px",
                  alignItems: "center"
                }}
              >
                <div className="typing-dot" style={{ width: "5px", height: "5px", backgroundColor: "var(--text-muted)", borderRadius: "50%", animation: "typing-bounce 1s infinite 0.1s" }} />
                <div className="typing-dot" style={{ width: "5px", height: "5px", backgroundColor: "var(--text-muted)", borderRadius: "50%", animation: "typing-bounce 1s infinite 0.2s" }} />
                <div className="typing-dot" style={{ width: "5px", height: "5px", backgroundColor: "var(--text-muted)", borderRadius: "50%", animation: "typing-bounce 1s infinite 0.3s" }} />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Predefined Questions Panel */}
          {messages.length <= 4 && !isTyping && (
            <div
              style={{
                padding: "10px 16px",
                display: "flex",
                flexDirection: "column",
                gap: "6px",
                borderTop: "1px solid var(--border-color)",
                backgroundColor: "var(--bg-surface)"
              }}
            >
               <span style={{ fontSize: "0.68rem", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase" }}>{t("waSampleQuestions", "Preguntas en Inglés (Traducción Demo):")}</span>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                {predefinedQuestions.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(q.text)}
                    style={{
                      textAlign: "left",
                      padding: "6px 12px",
                      borderRadius: "6px",
                      border: "1px solid var(--border-color)",
                      backgroundColor: "transparent",
                      color: "var(--text-main)",
                      fontSize: "0.75rem",
                      cursor: "pointer",
                      fontWeight: 600,
                      transition: "all 0.2s",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center"
                    }}
                    className="suggestion-btn"
                  >
                    <span>{q.text}</span>
                    <ArrowRight size={10} style={{ color: "var(--primary)" }} />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Chat input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(inputText);
            }}
            style={{
              padding: "12px 16px",
              backgroundColor: "var(--bg-surface)",
              borderTop: "1px solid var(--border-color)",
              display: "flex",
              gap: "8px",
              alignItems: "center"
            }}
          >
            <input
              type="text"
               placeholder={t("waInputPlaceholder", "Type in English / Escribe en Español...")}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              style={{
                flexGrow: 1,
                padding: "8px 12px",
                borderRadius: "var(--radius-sm)",
                border: "1px solid var(--border-color)",
                fontSize: "0.82rem",
                outline: "none",
                backgroundColor: "rgba(0,0,0,0.02)",
                color: "var(--text-heading)",
                fontFamily: "inherit"
              }}
            />
            <button
              type="submit"
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                backgroundColor: "var(--primary)",
                border: "none",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer"
              }}
            >
              <Send size={15} />
            </button>
          </form>
        </div>
      )}

      <style>{`
        @keyframes typing-bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
        .suggestion-btn:hover {
          border-color: var(--primary) !important;
          background-color: rgba(234, 179, 8, 0.05) !important;
        }
        @keyframes slide-up-fade {
          from { transform: translateY(15px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
