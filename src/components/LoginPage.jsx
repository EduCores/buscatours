import { useState } from "react";
import { ArrowLeft, Shield, Users, Globe } from "lucide-react";
import { useTranslation } from "../i18n/LanguageContext";
import { login } from "../services/firebaseAuth";

const PRESET_USERS = [
  { email: "admin@buscatours.com", password: "admin123", label: "Admin / PLATFORM_ADMIN" },
  { email: "editor@buscatours.com", password: "edit123", label: "Editor / TOUR_ADMIN" },
  { email: "operador1@buscatours.com", password: "op123456", label: "Operador 1 / OPERATOR" },
  { email: "operador2@buscatours.com", password: "op123456", label: "Operador 2 / OPERATOR" },
  { email: "operador3@buscatours.com", password: "op123456", label: "Operador 3 / OPERATOR" },
  { email: "operador4@buscatours.com", password: "op123456", label: "Operador 4 / OPERATOR" },
  { email: "cliente@buscatours.com", password: "client123", label: "Cliente / CUSTOMER" },
];

const LoginPage = ({ onBack, onLogin }) => {
  const { t } = useTranslation();

  const [authType, setAuthType] = useState("customer");
  const [authData, setAuthData] = useState({
    email: "",
    password: ""
  });

  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!authData.email || !authData.password) {
      setErrorMessage(t("logOrPassBlank", "Correo y contraseña son obligatorios."));
      return;
    }

    try {
      const user = await login(authData.email, authData.password);
      onLogin && onLogin({ email: user.email, uid: user.uid });
    } catch (e) {
      setErrorMessage(t("loginFailed", "Credenciales inválidas. Intente nuevamente."));
    }
  };

  return (
    <div style={{ minHeight: "100vh", padding: "120px 24px 48px", backgroundColor: "var(--bg-main)", color: "var(--text-main)" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "24px" }}>
        <button
          onClick={onBack}
          style={{
            alignSelf: "flex-start",
            background: "transparent",
            border: "none",
            color: "var(--primary)",
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            fontWeight: 700,
          }}
        >
          <ArrowLeft size={18} /> {t("loginBackToSite", "Volver al sitio")}
        </button>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.3fr", gap: "24px" }}>
          <aside style={{
            padding: "28px",
            borderRadius: "24px",
            backgroundColor: "rgba(255, 255, 255, 0.06)",
            boxShadow: "var(--shadow-sm)",
            border: "1px solid var(--border-color)"
          }}>
            <h1 style={{ fontSize: "2rem", marginBottom: "10px", color: "var(--text-heading)" }}>{t("loginTitle", "Iniciar Sesión")}</h1>
            <p style={{ color: "var(--text-muted)", lineHeight: "1.7" }}>
              {t("loginIntro", "Accede a tu cuenta de Busca Tours para reservar tours, gestionar tu lista de deseos y personalizar tu experiencia de viaje.")}
            </p>

            <div style={{ display: "flex", gap: "10px", marginTop: "22px" }}>
              <button
                type="button"
                onClick={() => setAuthType("customer")}
                style={{
                  flex: 1,
                  borderRadius: "14px",
                  border: authType === "customer" ? "2px solid var(--primary)" : "1px solid var(--border-color)",
                  background: authType === "customer" ? "rgba(56, 189, 248, 0.12)" : "transparent",
                  color: "var(--text-heading)",
                  padding: "14px 12px",
                  cursor: "pointer",
                  textAlign: "left"
                }}
              >
                <span style={{ display: "block", fontWeight: 700 }}>{t("loginCustomer", "Cliente")}</span>
                <small style={{ color: "var(--text-muted)" }}>{t("loginCustomerDesc", "Reservas y perfil viajero")}</small>
              </button>
              <button
                type="button"
                onClick={() => setAuthType("operator")}
                style={{
                  flex: 1,
                  borderRadius: "14px",
                  border: authType === "operator" ? "2px solid var(--primary)" : "1px solid var(--border-color)",
                  background: authType === "operator" ? "rgba(56, 189, 248, 0.12)" : "transparent",
                  color: "var(--text-heading)",
                  padding: "14px 12px",
                  cursor: "pointer",
                  textAlign: "left"
                }}
              >
                <span style={{ display: "block", fontWeight: 700 }}>{t("loginOperator", "Operador")}</span>
                <small style={{ color: "var(--text-muted)" }}>{t("loginOperatorDesc", "Publicar tours y gestionar ofertas")}</small>
              </button>
            </div>

            <div style={{ marginTop: "18px" }}>
              <label style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "0.8rem", color: "var(--text-muted)" }}>
                {t("loginPresetLabel", "Acceso rápido con usuario de prueba")}
                <select
                  value={`${authData.email}|${authData.password}`}
                  onChange={(e) => {
                    const [email, password] = e.target.value.split("|");
                    setAuthData({ email, password });
                  }}
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: "var(--radius-sm)",
                    border: "1px solid var(--border-color)",
                    backgroundColor: "rgba(0,0,0,0.15)",
                    color: "var(--text-heading)",
                    fontSize: "0.85rem",
                    outline: "none",
                  }}
                >
                  <option value="">{t("loginPresetPlaceholder", "Selecciona un usuario de prueba")}</option>
                  {PRESET_USERS.map((u) => (
                    <option key={u.email} value={`${u.email}|${u.password}`}>
                      {u.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div style={{ marginTop: "28px", display: "flex", flexDirection: "column", gap: "22px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <Shield size={24} style={{ color: "var(--primary)" }} />
                <div>
                  <strong>{t("loginSecureLogin", "Acceso seguro")}</strong>
                  <p style={{ margin: 0, color: "var(--text-muted)", fontSize: "0.88rem" }}>
                    {t("loginSecureLoginDesc", "Tu sesión se mantiene cifrada y protegida.")}
                  </p>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <Users size={24} style={{ color: "var(--accent)" }} />
                <div>
                  <strong>{t("loginEasyAccess", "Acceso rápido")}</strong>
                  <p style={{ margin: 0, color: "var(--text-muted)", fontSize: "0.88rem" }}>
                    {t("loginEasyAccessDesc", "Inicia sesión con tu correo o mediante Google/Apple.")}
                  </p>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <Globe size={24} style={{ color: "#CC3333" }} />
                <div>
                  <strong>{t("loginSocialLogin", "Iniciar con redes sociales")}</strong>
                  <p style={{ margin: 0, color: "var(--text-muted)", fontSize: "0.88rem" }}>
                    {t("loginSocialLoginDesc", "Conéctate usando Google o Apple si ya tienes la cuenta vinculada.")}
                  </p>
                </div>
              </div>
            </div>
          </aside>

          <section style={{
            padding: "28px",
            borderRadius: "24px",
            backgroundColor: "rgba(255,255,255,0.04)",
            boxShadow: "var(--shadow-sm)",
            border: "1px solid var(--border-color)"
          }}>
            <form onSubmit={handleSubmit} style={{ display: "grid", gap: "16px" }}>
              {errorMessage && (
                <div style={{ marginBottom: "16px", padding: "14px 16px", borderRadius: "var(--radius-sm)", backgroundColor: "rgba(239, 68, 68, 0.08)", color: "#b91c1c" }}>
                  {errorMessage}
                </div>
              )}

              <label style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "0.85rem", color: "var(--text-muted)" }}>
                {t("loginEmailLabel", "Correo electrónico")}
                <input type="email"
                       value={authData.email}
                       onChange={(e) => setAuthData(prev => ({ ...prev, email: e.target.value }))}
                       placeholder="juan@correo.com"
                       style={{ width: "100%", padding: "12px", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-color)", outline: "none", backgroundColor: "rgba(0,0,0,0.02)", color: "var(--text-heading)", fontFamily: "var(--font-body)" }}
                />
              </label>

              <label style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "0.85rem", color: "var(--text-muted)" }}>
                {t("loginPasswordLabel", "Contraseña")}
                <input type="password"
                       value={authData.password}
                       onChange={(e) => setAuthData(prev => ({ ...prev, password: e.target.value }))}
                       placeholder="********"
                       style={{ width: "100%", padding: "12px", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-color)", outline: "none", backgroundColor: "rgba(0,0,0,0.02)", color: "var(--text-heading)", fontFamily: "var(--font-body)" }}
                />
              </label>

              <button type="submit" className="btn btn-primary" style={{ width: "100%", padding: "14px 18px", fontSize: "0.95rem", fontWeight: 700, backgroundColor: "var(--primary)", border: "none", borderRadius: "var(--radius-sm)", color: "#fff", cursor: "pointer" }}>
                {t("loginLoginLabel", "Iniciar Sesión")}
              </button>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;