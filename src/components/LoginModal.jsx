import React, { useState } from "react";
import { X, Shield, Users, Globe } from "lucide-react";
import { useTranslation } from "../i18n/LanguageContext";
import { login } from "../services/firebaseAuth";
import { getFirebaseAuth, GoogleAuthProvider, OAuthProvider, signInWithPopup } from "../services/firebaseAuth";

const isEmulator = import.meta.env.VITE_USE_EMULATORS === 'true';

export default function LoginModal({ onClose, onLogin, onOpenRegister }) {
  const { t } = useTranslation();
  const [authData, setAuthData] = useState({ email: "", password: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isAppleLoading, setIsAppleLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!authData.email || !authData.password) {
      setErrorMessage(t("logOrPassBlank", "Correo y contraseña son obligatorios."));
      return;
    }
    try {
      const user = await login(authData.email, authData.password);
      onLogin && onLogin({ email: user.email, uid: user.uid });
      onClose();
    } catch (e) {
      setErrorMessage(t("loginFailed", "Credenciales inválidas. Intente nuevamente."));
    }
  };

  const handleGoogleLogin = async () => {
    if (isEmulator) {
      setErrorMessage(t("loginEmulatorGoogleNotSupported", "El inicio de sesión con Google no está disponible en modo emulador. Usá las credenciales de prueba."));
      return;
    }
    setIsGoogleLoading(true);
    setErrorMessage("");
    try {
      const auth = getFirebaseAuth();
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      onLogin && onLogin({ email: user.email, uid: user.uid });
      onClose();
    } catch (e) {
      setErrorMessage(t("loginFailed", "Error al iniciar sesión con Google. Intente nuevamente."));
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleAppleLogin = async () => {
    if (isEmulator) {
      setErrorMessage(t("loginEmulatorAppleNotSupported", "El inicio de sesión con Apple no está disponible en modo emulador. Usá las credenciales de prueba."));
      return;
    }
    setIsAppleLoading(true);
    setErrorMessage("");
    try {
      const auth = getFirebaseAuth();
      const provider = new OAuthProvider('apple.com');
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      onLogin && onLogin({ email: user.email, uid: user.uid });
      onClose();
    } catch (e) {
      setErrorMessage(t("loginFailed", "Error al iniciar sesión con Apple. Intente nuevamente."));
    } finally {
      setIsAppleLoading(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.65)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 200,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "860px",
          maxHeight: "90vh",
          overflow: "hidden",
          borderRadius: "24px",
          backgroundColor: "var(--bg-main)",
          color: "var(--text-main)",
          boxShadow: "var(--shadow-lg)",
          border: "1px solid var(--border-color)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "16px 20px",
            borderBottom: "1px solid var(--border-color)",
          }}
        >
          <span style={{ fontWeight: 800, fontSize: "1rem" }}>{t("loginTitle", "Iniciar Sesión")}</span>
          <button
            onClick={onClose}
            style={{
              background: "transparent",
              border: "none",
              color: "var(--text-main)",
              cursor: "pointer",
            }}
          >
            <X size={18} />
          </button>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1.3fr",
            overflow: "hidden",
          }}
        >
          <aside
            style={{
              padding: "24px",
              backgroundColor: "rgba(255, 255, 255, 0.04)",
              borderRight: "1px solid var(--border-color)",
            }}
          >
            <h2 style={{ fontSize: "1.4rem", marginBottom: "10px", color: "var(--text-heading)" }}>
              {t("loginTitle", "Iniciar Sesión")}
            </h2>
            <p style={{ color: "var(--text-muted)", lineHeight: "1.7", fontSize: "0.9rem" }}>
              {t("loginIntro", "Accede a tu cuenta de Busca Tours para reservar tours, gestionar tu lista de deseos y personalizar tu experiencia de viaje.")}
            </p>

            <div style={{ marginTop: "22px", display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <Shield size={20} style={{ color: "var(--primary)" }} />
                <div>
                  <strong style={{ fontSize: "0.85rem" }}>{t("loginSecureLogin", "Acceso seguro")}</strong>
                  <p style={{ margin: 0, color: "var(--text-muted)", fontSize: "0.78rem" }}>
                    {t("loginSecureLoginDesc", "Tu sesión se mantiene cifrada y protegida.")}
                  </p>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <Users size={20} style={{ color: "var(--accent)" }} />
                <div>
                  <strong style={{ fontSize: "0.85rem" }}>{t("loginEasyAccess", "Acceso rápido")}</strong>
                  <p style={{ margin: 0, color: "var(--text-muted)", fontSize: "0.78rem" }}>
                    {t("loginEasyAccessDesc", "Inicia sesión con tu correo o mediante Google/Apple.")}
                  </p>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <Globe size={20} style={{ color: "#CC3333" }} />
                <div>
                  <strong style={{ fontSize: "0.85rem" }}>{t("loginSocialLogin", "Iniciar con redes sociales")}</strong>
                  <p style={{ margin: 0, color: "var(--text-muted)", fontSize: "0.78rem" }}>
                    {t("loginSocialLoginDesc", "Conéctate usando Google o Apple si ya tienes la cuenta vinculada.")}
                  </p>
                </div>
              </div>
            </div>
          </aside>

          <section style={{ padding: "24px", backgroundColor: "rgba(255,255,255,0.02)" }}>
            <form onSubmit={handleSubmit} style={{ display: "grid", gap: "14px" }}>
              {errorMessage && (
                <div
                  style={{
                    padding: "10px 12px",
                    borderRadius: "12px",
                    backgroundColor: "rgba(239, 68, 68, 0.08)",
                    color: "#b91c1c",
                    fontSize: "0.85rem",
                  }}
                >
                  {errorMessage}
                </div>
              )}

              <label style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "0.8rem", color: "var(--text-muted)" }}>
                {t("loginEmailLabel", "Correo electrónico")}
                <input
                  type="email"
                  value={authData.email}
                  onChange={(e) => setAuthData((prev) => ({ ...prev, email: e.target.value }))}
                  placeholder="juan@correo.com"
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: "12px",
                    border: "1px solid var(--border-color)",
                    outline: "none",
                    backgroundColor: "rgba(0,0,0,0.15)",
                    color: "var(--text-heading)",
                    fontSize: "0.9rem",
                  }}
                />
              </label>

              <label style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "0.8rem", color: "var(--text-muted)" }}>
                {t("loginPasswordLabel", "Contraseña")}
                <input
                  type="password"
                  value={authData.password}
                  onChange={(e) => setAuthData((prev) => ({ ...prev, password: e.target.value }))}
                  placeholder="********"
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    borderRadius: "12px",
                    border: "1px solid var(--border-color)",
                    outline: "none",
                    backgroundColor: "rgba(0,0,0,0.15)",
                    color: "var(--text-heading)",
                    fontSize: "0.9rem",
                  }}
                />
              </label>

              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={isGoogleLoading || isEmulator}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  fontSize: "0.95rem",
                  fontWeight: 700,
                  backgroundColor: isEmulator ? "#e5e7eb" : "#fff",
                  border: "1px solid rgba(0,0,0,0.1)",
                  borderRadius: "12px",
                  color: isEmulator ? "#9ca3af" : "#3c4043",
                  cursor: isGoogleLoading || isEmulator ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                  opacity: (isGoogleLoading || isEmulator) ? 0.7 : 1
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                </svg>
                {isEmulator ? t("loginGoogleEmulatorDisabled", "Google no disponible en emulador") : (isGoogleLoading ? t("loginLoading", "Conectando...") : t("loginGoogleButton", "Ingresar con Google"))}
              </button>

              <button
                type="button"
                onClick={handleAppleLogin}
                disabled={isAppleLoading || isEmulator}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  fontSize: "0.95rem",
                  fontWeight: 700,
                  backgroundColor: isEmulator ? "#e5e7eb" : "#000",
                  border: "1px solid rgba(0,0,0,0.1)",
                  borderRadius: "12px",
                  color: isEmulator ? "#9ca3af" : "#fff",
                  cursor: isAppleLoading || isEmulator ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                  opacity: (isAppleLoading || isEmulator) ? 0.7 : 1
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.74 1.18 0 2.21-.93 3.55-.74 1.45.22 2.79.74 3.56 2.16-3.24 1.65-2.74 5.53.24 6.84-.67 1.83-1.59 3.63-2.43 5.91zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.32 2.32-2.12 4.36-3.74 4.25z"/>
                </svg>
                {isEmulator ? t("loginAppleEmulatorDisabled", "Apple no disponible en emulador") : (isAppleLoading ? t("loginLoading", "Conectando...") : t("loginAppleButton", "Ingresar con Apple"))}
              </button>

              <button
                type="submit"
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  fontSize: "0.95rem",
                  fontWeight: 700,
                  backgroundColor: "var(--primary)",
                  border: "none",
                  borderRadius: "12px",
                  color: "#fff",
                  cursor: "pointer",
                }}
              >
                {t("loginLoginLabel", "Ingresar")}
              </button>
            </form>

              <p style={{ textAlign: "center", marginTop: "20px", fontSize: "0.85rem", color: "var(--text-muted)" }}>
                {t("loginNoAccount", "¿No tienes cuenta?")}{" "}
                <button
                  type="button"
                  onClick={() => { onClose(); onOpenRegister?.(); }}
                  style={{
                    background: "none",
                    border: "none",
                    color: "var(--primary)",
                    fontWeight: 700,
                    cursor: "pointer",
                    fontSize: "0.85rem",
                    padding: 0,
                    marginLeft: "4px"
                  }}
                >
                  {t("loginRegisterLink", "Regístrate")}
                </button>
</p>
            </section>
        </div>
      </div>
    </div>
  );
}
