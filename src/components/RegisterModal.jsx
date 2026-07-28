import { useState } from "react";
import { X, Briefcase, Heart, UserPlus, ChevronLeft } from "lucide-react";
import { useTranslation } from "../i18n/LanguageContext";

const generateUserId = (prefix, name) => {
  const slug = (name || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "")
    .slice(0, 6) || "user";
  return `${prefix}-${slug}-${Math.random().toString(36).slice(2, 8)}`;
};

const DEFAULT_NOTE =
  "Tu cuenta se crea al instante. Los operadores pueden publicar tours y gestionar ofertas; los clientes pueden reservar tours con confianza.";

export default function RegisterModal({ onClose, onRegister, theme }) {
  const { t } = useTranslation();
  const [activeType, setActiveType] = useState("customer");
  const [errorMessage, setErrorMessage] = useState("");
  

  const [customerData, setCustomerData] = useState({
    fullName: "",
    email: "",
    phone: "",
    country: "Chile",
    city: "",
    birthdate: "",
    travelStyle: "Aventura",
    newsletter: true,
    password: "",
    confirmPassword: ""
  });

  const [operatorData, setOperatorData] = useState({
    companyName: "",
    contactName: "",
    email: "",
    phone: "",
    country: "Chile",
    city: "",
    website: "",
    taxId: "",
    operatingRegion: "Chile",
    specialties: [],
    maxGroupSize: 12,
    languages: "Español, Inglés",
    payoutAccount: "",
    description: "",
    password: "",
    confirmPassword: ""
  });

  const handleCustomerChange = (field, value) => {
    setCustomerData((prev) => ({ ...prev, [field]: value }));
  };

  const handleOperatorChange = (field, value) => {
    setOperatorData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleSpecialty = (name) => {
    setOperatorData((prev) => {
      const specialties = prev.specialties.includes(name)
        ? prev.specialties.filter((item) => item !== name)
        : [...prev.specialties, name];
      return { ...prev, specialties };
    });
  };

  const handleSelectType = (type) => {
    setActiveType(type);
    setErrorMessage("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setErrorMessage("");

    if (activeType === "customer") {
      const { fullName, email, phone, password, confirmPassword } = customerData;
      if (!fullName || !email || !phone) {
        setErrorMessage(t("regErrNameEmailPhone", "Completa nombre, correo y teléfono para continuar."));
        return;
      }
      if (password && password !== confirmPassword) {
        setErrorMessage(t("regErrPasswordMismatch", "Las contraseñas no coinciden."));
        return;
      }
      const newCustomer = {
        id: generateUserId("customer", fullName),
        name: fullName,
        email,
        role: "customer",
        description: `Cliente desde ${customerData.country}. Prefiere ${customerData.travelStyle}.`,
        profile: {
          fullName,
          phone,
          country: customerData.country,
          city: customerData.city,
          birthdate: customerData.birthdate,
          travelStyle: customerData.travelStyle,
          newsletter: customerData.newsletter
        },
        createdAt: new Date().toISOString()
      };
      onRegister(newCustomer);
      onClose();
    } else {
      const { companyName, contactName, email, phone, website, taxId, description, password, confirmPassword } = operatorData;
      if (!companyName || !contactName || !email || !phone || !taxId) {
        setErrorMessage(t("regErrOpRequired", "Completa los campos obligatorios para registrar tu operador."));
        return;
      }
      if (password && password !== confirmPassword) {
        setErrorMessage(t("regErrPasswordMismatch", "Las contraseñas no coinciden."));
        return;
      }
      const newOperator = {
        id: generateUserId("operator", companyName),
        name: companyName,
        email,
        role: "operator",
        description: description || `Operador turístico especializado en ${operatorData.operatingRegion}.`,
        profile: {
          contactName,
          phone,
          country: operatorData.country,
          city: operatorData.city,
          website,
          taxId,
          operatingRegion: operatorData.operatingRegion,
          specialties: operatorData.specialties,
          maxGroupSize: operatorData.maxGroupSize,
          languages: operatorData.languages,
          payoutAccount: operatorData.payoutAccount,
          description
        },
        createdAt: new Date().toISOString()
      };
      onRegister(newOperator);
      onClose();
    }
  };

  const isDarkTheme = true;
  const cardBg = "rgba(255, 255, 255, 0.06)";
  const cardBorder = "1px solid rgba(255, 255, 255, 0.12)";
  const panelTextColor = "var(--text-inverse)";
  const mutedTextColor = "rgba(255, 255, 255, 0.74)";
  const sectionBg = "rgba(255, 255, 255, 0.04)";

  const travelStyles = [
    { key: "Aventura", icon: "🏔️" },
    { key: "Cultural", icon: "🏛️" },
    { key: "Relax", icon: "🧘" },
    { key: "Familiar", icon: "👨‍👩‍👧‍👦" },
    { key: "Gastronómico", icon: "🍷" },
    { key: "Naturaleza", icon: "🌿" }
  ];

  const specialties = [
    "Trekking",
    "Montañismo",
    "Ciclismo",
    "Kayak/Rafting",
    "Fauna/Flora",
    "Cultural/Histórico",
    "Gastronómico",
    "Fotografía",
    "Bienestar/Relax",
    "Familiar",
    "Aventura Extrema",
    "Observación Estelar"
  ];

  const countries = [
    "Chile", "Argentina", "Perú", "México", "Colombia", "Ecuador", "Bolivia", "Brasil",
    "Uruguay", "Paraguay", "Costa Rica", "Panamá", "Guatemala", "República Dominicana", "Cuba"
  ];

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0,0,0,0.7)",
        backdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1100,
        fontFamily: "var(--font-body)",
        padding: "20px"
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "700px",
          maxHeight: "90vh",
          backgroundColor: "var(--bg-main)",
          borderRadius: "20px",
          border: "1px solid rgba(255,255,255,0.1)",
          boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          position: "relative",
          animation: "scale-up-fade 0.3s cubic-bezier(0.16, 1, 0.3, 1)"
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 24px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          <div>
            <h2 style={{ margin: 0, fontSize: "1.5rem", fontWeight: 800, color: "var(--text-heading)", display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "1.8rem" }}>📝</span>
              <span>{t("registerTitle", "Crear cuenta en Busca Tours")}</span>
            </h2>
            <p style={{ margin: "4px 0 0", fontSize: "0.85rem", color: "var(--text-muted)" }}>
              {t("registerIntro", "Elige tu perfil y completa los datos. Los operadores pueden publicar tours y gestionar ofertas; los clientes pueden reservar tours con confianza.")}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{ background: "transparent", border: "none", color: "var(--text-muted)", cursor: "pointer", padding: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}
            aria-label="Cerrar"
          >
            <X size={24} />
          </button>
        </div>

        {/* Type Selector */}
        <div style={{ padding: "0 24px 16px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", alignItems: "center" }}>
            <span style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", color: "var(--text-muted)", letterSpacing: "0.05em" }}>
              {t("registerSelectType", "¿Quién eres?")}
            </span>
            <button
              onClick={() => handleSelectType("customer")}
              className={`px-4 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                activeType === "customer"
                  ? "bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20"
                  : "bg-slate-900/50 text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-white/5"
              }`}
              style={{ display: "flex", alignItems: "center", gap: "8px", border: "1px solid transparent", cursor: "pointer", transition: "all 0.2s" }}
            >
              <Heart size={16} />
              <span>{t("registerCustomer", "Turista / Viajero")}</span>
            </button>
            <button
              onClick={() => handleSelectType("operator")}
              className={`px-4 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                activeType === "operator"
                  ? "bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20"
                  : "bg-slate-900/50 text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-white/5"
              }`}
              style={{ display: "flex", alignItems: "center", gap: "8px", border: "1px solid transparent", cursor: "pointer", transition: "all 0.2s" }}
            >
              <Briefcase size={16} />
              <span>{t("registerOperator", "Tour Operador")}</span>
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ padding: "24px", overflowY: "auto", maxHeight: "calc(90vh - 200px)" }}>
          {activeType === "customer" && (
            <section style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: 700, color: "var(--text-heading)", display: "flex", alignItems: "center", gap: "8px" }}>
                <Heart size={18} className="text-amber-500" />
                <span>{t("registerCustomerFormTitle", "Datos del Viajero")}</span>
              </h3>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, color: "var(--text-muted)", marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    {t("regLabelFullName", "Nombre completo")}
                  </label>
                  <input
                    type="text"
                    value={customerData.fullName}
                    onChange={(e) => handleCustomerChange("fullName", e.target.value)}
                    placeholder="Juan Pérez"
                    style={{ width: "100%", padding: "12px 14px", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(0,0,0,0.15)", color: "var(--text-heading)", fontSize: "0.95rem" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, color: "var(--text-muted)", marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    {t("regLabelEmail", "Correo electrónico")}
                  </label>
                  <input
                    type="email"
                    value={customerData.email}
                    onChange={(e) => handleCustomerChange("email", e.target.value)}
                    placeholder="juan@correo.com"
                    style={{ width: "100%", padding: "12px 14px", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(0,0,0,0.15)", color: "var(--text-heading)", fontSize: "0.95rem" }}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, color: "var(--text-muted)", marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    {t("regLabelPhone", "Teléfono")}
                  </label>
                  <input
                    type="tel"
                    value={customerData.phone}
                    onChange={(e) => handleCustomerChange("phone", e.target.value)}
                    placeholder="+56 9 1234 5678"
                    style={{ width: "100%", padding: "12px 14px", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(0,0,0,0.15)", color: "var(--text-heading)", fontSize: "0.95rem" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, color: "var(--text-muted)", marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    {t("regLabelBirthdate", "Fecha de nacimiento")}
                  </label>
                  <input
                    type="date"
                    value={customerData.birthdate}
                    onChange={(e) => handleCustomerChange("birthdate", e.target.value)}
                    style={{ width: "100%", padding: "12px 14px", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(0,0,0,0.15)", color: "var(--text-heading)", fontSize: "0.95rem" }}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, color: "var(--text-muted)", marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    {t("regLabelCountry", "País")}
                  </label>
                  <select
                    value={customerData.country}
                    onChange={(e) => handleCustomerChange("country", e.target.value)}
                    style={{ width: "100%", padding: "12px 14px", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(0,0,0,0.15)", color: "var(--text-heading)", fontSize: "0.95rem" }}
                  >
                    {["Chile", "Argentina", "Perú", "México", "Colombia", "Ecuador", "Bolivia", "Brasil", "Uruguay", "Paraguay", "Costa Rica", "Panamá", "Guatemala", "República Dominicana", "Cuba"].map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, color: "var(--text-muted)", marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    {t("regLabelCity", "Ciudad")}
                  </label>
                  <input
                    type="text"
                    value={customerData.city}
                    onChange={(e) => handleCustomerChange("city", e.target.value)}
                    placeholder="Santiago"
                    style={{ width: "100%", padding: "12px 14px", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(0,0,0,0.15)", color: "var(--text-heading)", fontSize: "0.95rem" }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, color: "var(--text-muted)", marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  {t("regLabelBirthdate", "Fecha de nacimiento")}
                </label>
                <input
                  type="date"
                  value={customerData.birthdate}
                  onChange={(e) => handleCustomerChange("birthdate", e.target.value)}
                  style={{ width: "100%", padding: "12px 14px", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(0,0,0,0.15)", color: "var(--text-heading)", fontSize: "0.95rem" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, color: "var(--text-muted)", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  {t("regLabelTravelStyle", "Estilo de viaje preferido")}
                </label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {travelStyles.map((style) => (
                    <label
                      key={style.key}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        padding: "8px 14px",
                        borderRadius: "20px",
                        border: `2px solid ${customerData.travelStyle === style.key ? "var(--primary)" : "rgba(255,255,255,0.15)"}`,
                        background: customerData.travelStyle === style.key ? "rgba(234,179,8,0.15)" : "rgba(0,0,0,0.15)",
                        cursor: "pointer",
                        transition: "all 0.2s",
                        fontSize: "0.85rem",
                        fontWeight: 500,
                        color: customerData.travelStyle === style.key ? "var(--primary)" : "var(--text-heading)"
                      }}
                    >
                      <input
                        type="radio"
                        name="travelStyle"
                        value={style.key}
                        checked={customerData.travelStyle === style.key}
                        onChange={() => handleCustomerChange("travelStyle", style.key)}
                        style={{ display: "none" }}
                      />
                      <span>{style.icon}</span>
                      <span>{style.key}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label style={{ display: "flex", alignItems: "flex-start", gap: "10px", cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={customerData.newsletter}
                    onChange={(e) => handleCustomerChange("newsletter", e.target.checked)}
                    style={{ width: "18px", height: "18px", accentColor: "var(--primary)", marginTop: "2px", flexShrink: 0 }}
                  />
                  <span style={{ fontSize: "0.85rem", color: "var(--text-muted)", lineHeight: 1.5 }}>
                    {t("regNewsletter", "Quiero recibir ofertas, promociones y nuevas rutas por correo.")}
                  </span>
                </label>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, color: "var(--text-muted)", marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    {t("regLabelPassword", "Contraseña")}
                  </label>
                  <input
                    type="password"
                    value={customerData.password}
                    onChange={(e) => handleCustomerChange("password", e.target.value)}
                    placeholder="Mínimo 6 caracteres"
                    style={{ width: "100%", padding: "12px 14px", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(0,0,0,0.15)", color: "var(--text-heading)", fontSize: "0.95rem" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, color: "var(--text-muted)", marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    {t("regLabelRepeatPassword", "Repetir contraseña")}
                  </label>
                  <input
                    type="password"
                    value={customerData.confirmPassword}
                    onChange={(e) => handleCustomerChange("confirmPassword", e.target.value)}
                    placeholder="Repite la contraseña"
                    style={{ width: "100%", padding: "12px 14px", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(0,0,0,0.15)", color: "var(--text-heading)", fontSize: "0.95rem" }}
                  />
                </div>
              </div>
            </section>
          )}

          {activeType === "operator" && (
            <section style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: 700, color: "var(--text-heading)", display: "flex", alignItems: "center", gap: "8px" }}>
                <Briefcase size={18} className="text-amber-500" />
                <span>{t("registerOperatorFormTitle", "Registro de Operador Turístico")}</span>
              </h3>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, color: "var(--text-muted)", marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    {t("regLabelCompanyName", "Nombre de la empresa / Operador")}
                  </label>
                  <input
                    type="text"
                    value={operatorData.companyName}
                    onChange={(e) => handleOperatorChange("companyName", e.target.value)}
                    placeholder="Andes Expeditions"
                    style={{ width: "100%", padding: "12px 14px", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(0,0,0,0.15)", color: "var(--text-heading)", fontSize: "0.95rem" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, color: "var(--text-muted)", marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    {t("regLabelContactName", "Nombre de contacto")}
                  </label>
                  <input
                    type="text"
                    value={operatorData.contactName}
                    onChange={(e) => handleOperatorChange("contactName", e.target.value)}
                    placeholder="María González"
                    style={{ width: "100%", padding: "12px 14px", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(0,0,0,0.15)", color: "var(--text-heading)", fontSize: "0.95rem" }}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, color: "var(--text-muted)", marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    {t("regLabelEmail", "Correo electrónico")}
                  </label>
                  <input
                    type="email"
                    value={operatorData.email}
                    onChange={(e) => handleOperatorChange("email", e.target.value)}
                    placeholder="contacto@operador.com"
                    style={{ width: "100%", padding: "12px 14px", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(0,0,0,0.15)", color: "var(--text-heading)", fontSize: "0.95rem" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, color: "var(--text-muted)", marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    {t("regLabelOpPhone", "Teléfono")}
                  </label>
                  <input
                    type="tel"
                    value={operatorData.phone}
                    onChange={(e) => handleOperatorChange("phone", e.target.value)}
                    placeholder="+56 9 1234 5678"
                    style={{ width: "100%", padding: "12px 14px", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(0,0,0,0.15)", color: "var(--text-heading)", fontSize: "0.95rem" }}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, color: "var(--text-muted)", marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    {t("regLabelOpCountry", "País")}
                  </label>
                  <select
                    value={operatorData.country}
                    onChange={(e) => handleOperatorChange("country", e.target.value)}
                    style={{ width: "100%", padding: "12px 14px", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(0,0,0,0.15)", color: "var(--text-heading)", fontSize: "0.95rem" }}
                  >
                    {["Chile", "Argentina", "Perú", "México", "Colombia", "Ecuador", "Bolivia", "Brasil", "Uruguay", "Paraguay", "Costa Rica", "Panamá", "Guatemala", "República Dominicana", "Cuba"].map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, color: "var(--text-muted)", marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    {t("regLabelOpCity", "Ciudad")}
                  </label>
                  <input
                    type="text"
                    value={operatorData.city}
                    onChange={(e) => handleOperatorChange("city", e.target.value)}
                    placeholder="Santiago"
                    style={{ width: "100%", padding: "12px 14px", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(0,0,0,0.15)", color: "var(--text-heading)", fontSize: "0.95rem" }}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, color: "var(--text-muted)", marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    {t("regLabelOpRegion", "Región de operación")}
                  </label>
                  <input
                    type="text"
                    value={operatorData.operatingRegion}
                    onChange={(e) => handleOperatorChange("operatingRegion", e.target.value)}
                    placeholder="Chile, Argentina, Perú"
                    style={{ width: "100%", padding: "12px 14px", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(0,0,0,0.15)", color: "var(--text-heading)", fontSize: "0.95rem" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, color: "var(--text-muted)", marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    {t("regLabelOpWebsite", "Sitio web")}
                  </label>
                  <input
                    type="url"
                    value={operatorData.website}
                    onChange={(e) => handleOperatorChange("website", e.target.value)}
                    placeholder="https://mioperador.com"
                    style={{ width: "100%", padding: "12px 14px", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(0,0,0,0.15)", color: "var(--text-heading)", fontSize: "0.95rem" }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, color: "var(--text-muted)", marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  {t("regLabelTaxId", "RUT / Tax ID")}
                </label>
                <input
                  type="text"
                  value={operatorData.taxId}
                  onChange={(e) => handleOperatorChange("taxId", e.target.value)}
                  placeholder="76.123.456-7"
                  style={{ width: "100%", padding: "12px 14px", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(0,0,0,0.15)", color: "var(--text-heading)", fontSize: "0.95rem" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, color: "var(--text-muted)", marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  {t("regLabelOpRegion", "Región de operación")}
                </label>
                <input
                  type="text"
                  value={operatorData.operatingRegion}
                  onChange={(e) => handleOperatorChange("operatingRegion", e.target.value)}
                  placeholder="Chile, Argentina, Perú"
                  style={{ width: "100%", padding: "12px 14px", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(0,0,0,0.15)", color: "var(--text-heading)", fontSize: "0.95rem" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, color: "var(--text-muted)", marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  {t("regLabelSpecialties", "Especialidades principales")}
                </label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {specialties.map((s) => (
                    <label
                      key={s}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        padding: "8px 14px",
                        borderRadius: "20px",
                        border: `2px solid ${operatorData.specialties.includes(s) ? "var(--primary)" : "rgba(255,255,255,0.15)"}`,
                        background: operatorData.specialties.includes(s) ? "rgba(234,179,8,0.15)" : "rgba(0,0,0,0.15)",
                        cursor: "pointer",
                        transition: "all 0.2s",
                        fontSize: "0.85rem",
                        fontWeight: 500,
                        color: operatorData.specialties.includes(s) ? "var(--primary)" : "var(--text-heading)"
                      }}
                    >
                      <input
                        type="checkbox"
                        value={s}
                        checked={operatorData.specialties.includes(s)}
                        onChange={() => toggleSpecialty(s)}
                        style={{ display: "none" }}
                      />
                      <span>{s}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, color: "var(--text-muted)", marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    {t("regLabelMaxGroup", "Capacidad máxima de grupo")}
                  </label>
                  <input
                    type="number"
                    value={operatorData.maxGroupSize}
                    onChange={(e) => handleOperatorChange("maxGroupSize", parseInt(e.target.value) || 0)}
                    min="1"
                    max="100"
                    style={{ width: "100%", padding: "12px 14px", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(0,0,0,0.15)", color: "var(--text-heading)", fontSize: "0.95rem" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, color: "var(--text-muted)", marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    {t("regLabelLanguages", "Idiomas")}
                  </label>
                  <input
                    type="text"
                    value={operatorData.languages}
                    onChange={(e) => handleOperatorChange("languages", e.target.value)}
                    placeholder="Español, Inglés, Portugués"
                    style={{ width: "100%", padding: "12px 14px", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(0,0,0,0.15)", color: "var(--text-heading)", fontSize: "0.95rem" }}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, color: "var(--text-muted)", marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    {t("regLabelPayoutAccount", "Cuenta de pagos")}
                  </label>
                  <input
                    type="text"
                    value={operatorData.payoutAccount}
                    onChange={(e) => handleOperatorChange("payoutAccount", e.target.value)}
                    placeholder="MercadoPago / Banco / Transferencia"
                    style={{ width: "100%", padding: "12px 14px", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(0,0,0,0.15)", color: "var(--text-heading)", fontSize: "0.95rem" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, color: "var(--text-muted)", marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    {t("regLabelOpPassword", "Contraseña")}
                  </label>
                  <input
                    type="password"
                    value={operatorData.password}
                    onChange={(e) => handleOperatorChange("password", e.target.value)}
                    placeholder="Mínimo 6 caracteres"
                    style={{ width: "100%", padding: "12px 14px", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(0,0,0,0.15)", color: "var(--text-heading)", fontSize: "0.95rem" }}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, color: "var(--text-muted)", marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    {t("regLabelOpRepeatPassword", "Repetir contraseña")}
                  </label>
                  <input
                    type="password"
                    value={operatorData.confirmPassword}
                    onChange={(e) => handleOperatorChange("confirmPassword", e.target.value)}
                    placeholder="Repite la contraseña"
                    style={{ width: "100%", padding: "12px 14px", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(0,0,0,0.15)", color: "var(--text-heading)", fontSize: "0.95rem" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, color: "var(--text-muted)", marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    {t("regLabelTaxId", "RUT / Tax ID")}
                  </label>
                  <input
                    type="text"
                    value={operatorData.taxId}
                    onChange={(e) => handleOperatorChange("taxId", e.target.value)}
                    placeholder="76.123.456-7"
                    style={{ width: "100%", padding: "12px 14px", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(0,0,0,0.15)", color: "var(--text-heading)", fontSize: "0.95rem" }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, color: "var(--text-muted)", marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  {t("regLabelWebsite", "Sitio web")}
                </label>
                <input
                  type="url"
                  value={operatorData.website}
                  onChange={(e) => handleOperatorChange("website", e.target.value)}
                  placeholder="https://mioperador.com"
                  style={{ width: "100%", padding: "12px 14px", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(0,0,0,0.15)", color: "var(--text-heading)", fontSize: "0.95rem" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, color: "var(--text-muted)", marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  {t("regLabelOpPresentation", "Presentación de la empresa")}
                </label>
                <textarea
                  value={operatorData.description}
                  onChange={(e) => handleOperatorChange("description", e.target.value)}
                  placeholder="Describe tu propuesta de valor, experiencia y tipo de clientes a los que atiendes."
                  style={{ width: "100%", padding: "12px 14px", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(0,0,0,0.15)", color: "var(--text-heading)", minHeight: "100px", resize: "vertical", fontSize: "0.95rem", fontFamily: "inherit" }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, color: "var(--text-muted)", marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    {t("regLabelOpPassword", "Contraseña")}
                  </label>
                  <input
                    type="password"
                    value={operatorData.password}
                    onChange={(e) => handleOperatorChange("password", e.target.value)}
                    placeholder="Mínimo 6 caracteres"
                    style={{ width: "100%", padding: "12px 14px", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(0,0,0,0.15)", color: "var(--text-heading)", fontSize: "0.95rem" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, color: "var(--text-muted)", marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    {t("regLabelOpRepeatPassword", "Repetir contraseña")}
                  </label>
                  <input
                    type="password"
                    value={operatorData.confirmPassword}
                    onChange={(e) => handleOperatorChange("confirmPassword", e.target.value)}
                    placeholder="Repite la contraseña"
                    style={{ width: "100%", padding: "12px 14px", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(0,0,0,0.15)", color: "var(--text-heading)", fontSize: "0.95rem" }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, color: "var(--text-muted)", marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  {t("regLabelTaxId", "RUT / Tax ID")}
                </label>
                <input
                  type="text"
                  value={operatorData.taxId}
                  onChange={(e) => handleOperatorChange("taxId", e.target.value)}
                  placeholder="76.123.456-7"
                  style={{ width: "100%", padding: "12px 14px", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(0,0,0,0.15)", color: "var(--text-heading)", fontSize: "0.95rem" }}
                />
              </div>
            </section>
          )}

          {errorMessage && (
            <div style={{ padding: "12px 16px", background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "10px", color: "#f87171", fontSize: "0.85rem", display: "flex", alignItems: "center", gap: "8px" }}>
              <span>⚠</span> {errorMessage}
            </div>
          )}

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "8px", paddingTop: "16px", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
            <button
              type="button"
              onClick={onClose}
              style={{ padding: "12px 24px", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(0,0,0,0.2)", color: "var(--text-muted)", fontWeight: 600, fontSize: "0.9rem", cursor: "pointer", transition: "all 0.2s" }}
            >
              {t("common.cancel", "Cancelar")}
            </button>
            <button
              type="submit"
              style={{ padding: "12px 28px", borderRadius: "10px", border: "none", background: "var(--primary)", color: "#fff", fontWeight: 700, fontSize: "0.95rem", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", transition: "all 0.2s" }}
            >
              <UserPlus size={16} />
              <span>{activeType === "customer" ? t("registerCustomer", "Crear cuenta de viajero") : t("registerOperator", "Registrar operador")}</span>
            </button>
          </div>
        </form>
      </div>
      <style>{`
        @keyframes scale-up-fade {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin { animation: spin 1s linear infinite; }
      `}</style>
    </div>
  );
}