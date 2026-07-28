import { useState } from "react";
import { ArrowLeft, Briefcase, Heart, UserPlus } from "lucide-react";
import { useTranslation } from '../i18n/LanguageContext';

const generateUserId = (prefix, name) => {
  const slug = (name || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]/g, "")
    .slice(0, 6) || "user";
  return `${prefix}-${slug}-${Math.random().toString(36).slice(2, 8)}`;
};

export default function RegisterPage({ onBack, onRegister, theme }) {
  const { t } = useTranslation();
  const [activeType, setActiveType] = useState("customer");
  const [errorMessage, setErrorMessage] = useState("");
  const isDarkTheme = theme && theme !== "light";
  const cardBg = isDarkTheme ? "rgba(255, 255, 255, 0.06)" : "var(--bg-surface)";
  const cardBorder = isDarkTheme ? "1px solid rgba(255, 255, 255, 0.12)" : "1px solid var(--border-color)";
  const panelTextColor = isDarkTheme ? "var(--text-inverse)" : "var(--text-main)";
  const mutedTextColor = isDarkTheme ? "rgba(255, 255, 255, 0.74)" : "var(--text-muted)";
  const sectionBg = isDarkTheme ? "rgba(255, 255, 255, 0.04)" : "var(--bg-surface)";

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
        }
      };
      onRegister(newCustomer);
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
        }
      };
      onRegister(newOperator);
    }
  };

  return (
    <div style={{ minHeight: "100vh", padding: "120px 24px 48px", backgroundColor: "var(--bg-main)", color: panelTextColor }}>
      <div style={{ maxWidth: "980px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "24px" }}>
        <button
          onClick={onBack}
          style={{ alignSelf: "flex-start", background: "transparent", border: "none", color: "var(--primary)", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "8px", fontWeight: 700 }}
        >
          <ArrowLeft size={18} /> {t('registerBackToSite', 'Volver al sitio')}
        </button>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.3fr", gap: "24px" }}>
          <aside style={{ padding: "28px", borderRadius: "24px", backgroundColor: cardBg, boxShadow: "var(--shadow-sm)", border: cardBorder }}>
            <h1 style={{ fontSize: "2rem", marginBottom: "10px", color: "var(--text-heading)" }}>{t('registerTitle', 'Registro en Busca Tours')}</h1>
            <p style={{ color: mutedTextColor, lineHeight: "1.7" }}>
              {t('registerIntro', 'Elige tu perfil y completa los datos. Los operadores podrán publicar ofertas turísticas y los clientes podrán reservar tours con confianza.')}
            </p>
            <div role="group" aria-label={t('registerSelectAccountType', 'Seleccionar tipo de cuenta')} style={{ display: "flex", gap: "10px", marginTop: "22px" }}>
              <button
                type="button"
                onClick={() => handleSelectType("customer")}
                aria-pressed={activeType === "customer"}
                style={{
                  flex: 1,
                  borderRadius: "14px",
                  border: activeType === "customer" ? "2px solid var(--primary)" : "1px solid var(--border-color)",
                  background: activeType === "customer" ? "rgba(56, 189, 248, 0.12)" : "transparent",
                  color: "var(--text-heading)",
                  padding: "14px 12px",
                  cursor: "pointer",
                  textAlign: "left"
                }}
              >
                <span style={{ display: "block", fontWeight: 700 }}>{t('registerClient', 'Cliente')}</span>
                <small style={{ color: mutedTextColor }}>{t('registerClientDesc', 'Reservas y perfil viajero')}</small>
              </button>
              <button
                type="button"
                onClick={() => handleSelectType("operator")}
                aria-pressed={activeType === "operator"}
                style={{
                  flex: 1,
                  borderRadius: "14px",
                  border: activeType === "operator" ? "2px solid var(--primary)" : "1px solid var(--border-color)",
                  background: activeType === "operator" ? "rgba(56, 189, 248, 0.12)" : "transparent",
                  color: "var(--text-heading)",
                  padding: "14px 12px",
                  cursor: "pointer",
                  textAlign: "left"
                }}
              >
                <span style={{ display: "block", fontWeight: 700 }}>{t('registerOperator', 'Operador')}</span>
                <small style={{ color: mutedTextColor }}>{t('registerOperatorDesc', 'Publicar tours y gestionar ofertas')}</small>
              </button>
            </div>

            <div style={{ marginTop: "28px", display: "flex", flexDirection: "column", gap: "22px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <UserPlus size={24} style={{ color: "var(--primary)" }} />
                <div>
                  <strong>{t('registerEasySignup', 'Inscripción fácil')}</strong>
                  <p style={{ margin: 0, color: mutedTextColor, fontSize: "0.88rem" }}>{t('registerEasySignupDesc', 'Registra tu cuenta en menos de 3 minutos.')}</p>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <Heart size={24} style={{ color: "var(--accent)" }} />
                <div>
                  <strong>{t('registerSecurePayment', 'Pago seguro')}</strong>
                  <p style={{ margin: 0, color: mutedTextColor, fontSize: "0.88rem" }}>{t('registerSecurePaymentDesc', 'Tus datos quedan dentro de la plataforma, sin salida hasta la confirmación.')}</p>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <Briefcase size={24} style={{ color: "#f59e0b" }} />
                <div>
                  <strong>{t('registerSalesDayOne', 'Ventas desde el primer día')}</strong>
                  <p style={{ margin: 0, color: mutedTextColor, fontSize: "0.88rem" }}>{t('registerSalesDayOneDesc', 'Publica tours, promociona paquetes y recibe clientes sin invertir en infraestructura.')}</p>
                </div>
              </div>
            </div>
          </aside>

          <section style={{ padding: "28px", borderRadius: "24px", backgroundColor: sectionBg, boxShadow: "var(--shadow-sm)", border: cardBorder }}>
            <h2 style={{ fontSize: "1.35rem", fontWeight: 800, marginBottom: "18px", color: "var(--text-heading)" }}>
              {activeType === "customer" ? t('registerCustomerFormTitle', 'Registro de Cliente Final') : t('registerOperatorFormTitle', 'Registro de Operador Turístico')}
            </h2>

            {errorMessage && (
              <div style={{ marginBottom: "18px", padding: "14px 16px", borderRadius: "var(--radius-sm)", backgroundColor: "rgba(239, 68, 68, 0.08)", color: "#b91c1c" }}>
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: "grid", gap: "16px" }}>
              {activeType === "customer" ? (
                <>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                    <label style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "0.85rem", color: "var(--text-muted)" }}>
                      {t('regLabelFullName', 'Nombre completo')}
                      <input type="text" value={customerData.fullName} onChange={(e) => handleCustomerChange("fullName", e.target.value)} placeholder={t('regPhFullName', 'Juan Pérez')} style={{ padding: "12px", borderRadius: "12px", border: "1px solid var(--border-color)", outline: "none" }} />
                    </label>
                    <label style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "0.85rem", color: "var(--text-muted)" }}>
                      {t('regLabelEmail', 'Correo electrónico')}
                      <input type="email" value={customerData.email} onChange={(e) => handleCustomerChange("email", e.target.value)} placeholder={t('regPhEmail', 'juan@correo.com')} style={{ padding: "12px", borderRadius: "12px", border: "1px solid var(--border-color)", outline: "none" }} />
                    </label>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                    <label style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "0.85rem", color: "var(--text-muted)" }}>
                      {t('regLabelPhone', 'Teléfono')}
                      <input type="tel" value={customerData.phone} onChange={(e) => handleCustomerChange("phone", e.target.value)} placeholder={t('regPhPhone', '+56 9 1234 5678')} style={{ padding: "12px", borderRadius: "12px", border: "1px solid var(--border-color)", outline: "none" }} />
                    </label>
                    <label style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "0.85rem", color: "var(--text-muted)" }}>
                      {t('regLabelCountry', 'País')}
                      <select 
                        value={customerData.country} 
                        onChange={(e) => handleCustomerChange("country", e.target.value)} 
                        style={{ padding: "12px", borderRadius: "12px", border: "1px solid var(--border-color)", outline: "none", backgroundColor: "var(--bg-surface)", color: "var(--text-main)" }}
                      >
                        <option value="Chile">🇨🇱 Chile</option>
                        <option value="Argentina">🇦🇷 Argentina</option>
                        <option value="Perú">🇵🇪 Perú</option>
                        <option value="Colombia">🇨🇴 Colombia</option>
                        <option value="Brasil">🇧🇷 Brasil</option>
                        <option value="Bolivia">🇧🇴 Bolivia</option>
                        <option value="Ecuador">🇪🇨 Ecuador</option>
                        <option value="EE.UU.">🇺🇸 EE.UU.</option>
                        <option value="Alemania">🇩🇪 Alemania</option>
                        <option value="Francia">🇫🇷 Francia</option>
                        <option value="España">🇪🇸 España</option>
                      </select>
                    </label>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                    <label style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "0.85rem", color: "var(--text-muted)" }}>
                      {t('regLabelCity', 'Ciudad')}
                      <input type="text" value={customerData.city} onChange={(e) => handleCustomerChange("city", e.target.value)} placeholder={t('regPhCity', 'Santiago')} style={{ padding: "12px", borderRadius: "12px", border: "1px solid var(--border-color)", outline: "none" }} />
                    </label>
                    <label style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "0.85rem", color: "var(--text-muted)" }}>
                      {t('regLabelBirthdate', 'Fecha de nacimiento')}
                      <input type="date" value={customerData.birthdate} onChange={(e) => handleCustomerChange("birthdate", e.target.value)} style={{ padding: "12px", borderRadius: "12px", border: "1px solid var(--border-color)", outline: "none" }} />
                    </label>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                    <label style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "0.85rem", color: "var(--text-muted)" }}>
                      {t('regLabelTravelStyle', 'Estilo de viaje preferido')}
                      <select value={customerData.travelStyle} onChange={(e) => handleCustomerChange("travelStyle", e.target.value)} style={{ padding: "12px", borderRadius: "12px", border: "1px solid var(--border-color)", outline: "none" }}>
                        <option value="Aventura">{t('regStyleAdventure', 'Aventura')}</option>
                        <option value="Cultural">{t('regStyleCultural', 'Cultural')}</option>
                        <option value="Relax">{t('regStyleRelax', 'Relax')}</option>
                        <option value="Familiar">{t('regStyleFamiliar', 'Familiar')}</option>
                      </select>
                    </label>
                    <label style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "0.85rem", color: "var(--text-muted)" }}>
                      {t('regLabelPassword', 'Contraseña')}
                      <input type="password" value={customerData.password} onChange={(e) => handleCustomerChange("password", e.target.value)} placeholder="********" style={{ padding: "12px", borderRadius: "12px", border: "1px solid var(--border-color)", outline: "none" }} />
                    </label>
                  </div>

                  <label style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "0.85rem", color: "var(--text-muted)" }}>
                      {t('regLabelRepeatPassword', 'Repite contraseña')}
                      <input type="password" value={customerData.confirmPassword} onChange={(e) => handleCustomerChange("confirmPassword", e.target.value)} placeholder="********" style={{ padding: "12px", borderRadius: "12px", border: "1px solid var(--border-color)", outline: "none" }} />
                  </label>

                  <label style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "0.9rem", color: "var(--text-muted)", marginTop: "4px" }}>
                    <input type="checkbox" checked={customerData.newsletter} onChange={(e) => handleCustomerChange("newsletter", e.target.checked)} />
                    {t('regNewsletter', 'Quiero recibir ofertas, promociones y nuevas rutas por correo.')}
                  </label>
                </>
              ) : (
                <>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                    <label style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "0.85rem", color: "var(--text-muted)" }}>
                      {t('regLabelCompanyName', 'Nombre de la empresa')}
                      <input type="text" value={operatorData.companyName} onChange={(e) => handleOperatorChange("companyName", e.target.value)} placeholder={t('regPhCompanyName', 'Patagonia Wild Outdoors')} style={{ padding: "12px", borderRadius: "12px", border: "1px solid var(--border-color)", outline: "none" }} />
                    </label>
                    <label style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "0.85rem", color: "var(--text-muted)" }}>
                      {t('regLabelContactName', 'Nombre de contacto')}
                      <input type="text" value={operatorData.contactName} onChange={(e) => handleOperatorChange("contactName", e.target.value)} placeholder={t('regPhContactName', 'María Pérez')} style={{ padding: "12px", borderRadius: "12px", border: "1px solid var(--border-color)", outline: "none" }} />
                    </label>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                    <label style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "0.85rem", color: "var(--text-muted)" }}>
                      {t('regLabelOpEmail', 'Correo electrónico')}
                      <input type="email" value={operatorData.email} onChange={(e) => handleOperatorChange("email", e.target.value)} placeholder={t('regPhOpEmail', 'operador@empresa.com')} style={{ padding: "12px", borderRadius: "12px", border: "1px solid var(--border-color)", outline: "none" }} />
                    </label>
                    <label style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "0.85rem", color: "var(--text-muted)" }}>
                      {t('regLabelOpPhone', 'Teléfono')}
                      <input type="tel" value={operatorData.phone} onChange={(e) => handleOperatorChange("phone", e.target.value)} placeholder={t('regPhOpPhone', '+56 9 1234 5678')} style={{ padding: "12px", borderRadius: "12px", border: "1px solid var(--border-color)", outline: "none" }} />
                    </label>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                    <label style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "0.85rem", color: "var(--text-muted)" }}>
                      {t('regLabelOpCountry', 'País')}
                      <select 
                        value={operatorData.country} 
                        onChange={(e) => handleOperatorChange("country", e.target.value)} 
                        style={{ padding: "12px", borderRadius: "12px", border: "1px solid var(--border-color)", outline: "none", backgroundColor: "var(--bg-surface)", color: "var(--text-main)" }}
                      >
                        <option value="Chile">🇨🇱 Chile</option>
                        <option value="Argentina">🇦🇷 Argentina</option>
                        <option value="Perú">🇵🇪 Perú</option>
                        <option value="Colombia">🇨🇴 Colombia</option>
                        <option value="Brasil">🇧🇷 Brasil</option>
                        <option value="Bolivia">🇧🇴 Bolivia</option>
                        <option value="Ecuador">🇪🇨 Ecuador</option>
                        <option value="EE.UU.">🇺🇸 EE.UU.</option>
                        <option value="Alemania">🇩🇪 Alemania</option>
                        <option value="Francia">🇫🇷 Francia</option>
                        <option value="España">🇪🇸 España</option>
                      </select>
                    </label>
                    <label style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "0.85rem", color: "var(--text-muted)" }}>
                      {t('regLabelOpCity', 'Ciudad')}
                      <input type="text" value={operatorData.city} onChange={(e) => handleOperatorChange("city", e.target.value)} placeholder={t('regPhOpCity', 'Puerto Natales')} style={{ padding: "12px", borderRadius: "12px", border: "1px solid var(--border-color)", outline: "none" }} />
                    </label>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                    <label style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "0.85rem", color: "var(--text-muted)" }}>
                      {t('regLabelWebsite', 'Sitio web')}
                      <input type="text" value={operatorData.website} onChange={(e) => handleOperatorChange("website", e.target.value)} placeholder={t('regPhWebsite', 'https://patagoniaoutdoors.cl')} style={{ padding: "12px", borderRadius: "12px", border: "1px solid var(--border-color)", outline: "none" }} />
                    </label>
                    <label style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "0.85rem", color: "var(--text-muted)" }}>
                      {t('regLabelTaxId', 'RUT / Tax ID')}
                      <input type="text" value={operatorData.taxId} onChange={(e) => handleOperatorChange("taxId", e.target.value)} placeholder={t('regPhTaxId', '76.123.456-7')} style={{ padding: "12px", borderRadius: "12px", border: "1px solid var(--border-color)", outline: "none" }} />
                    </label>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                    <label style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "0.85rem", color: "var(--text-muted)" }}>
                      {t('regLabelRegion', 'Región de operación')}
                      <select value={operatorData.operatingRegion} onChange={(e) => handleOperatorChange("operatingRegion", e.target.value)} style={{ padding: "12px", borderRadius: "12px", border: "1px solid var(--border-color)", outline: "none" }}>
                        <option>Chile</option>
                        <option>Argentina</option>
                        <option>Brasil</option>
                        <option>Colombia</option>
                        <option>Perú</option>
                        <option>Latam</option>
                      </select>
                    </label>
                    <label style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "0.85rem", color: "var(--text-muted)" }}>
                      {t('regLabelLanguages', 'Idiomas')}
                      <input type="text" value={operatorData.languages} onChange={(e) => handleOperatorChange("languages", e.target.value)} placeholder={t('regPhLanguages', 'Español, Inglés')} style={{ padding: "12px", borderRadius: "12px", border: "1px solid var(--border-color)", outline: "none" }} />
                    </label>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "0.85rem", color: "var(--text-muted)" }}>
                    <span>{t('regLabelSpecialties', 'Especialidades principales')}</span>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "10px" }}>
                      {[
                        "Trekking",
                        "Cultural",
                        "Ecoturismo",
                        "Familiar",
                        "Aventura",
                        "Relax"
                      ].map((label) => (
                        <button
                          key={label}
                          type="button"
                          onClick={() => toggleSpecialty(label)}
                          style={{
                            borderRadius: "999px",
                            border: operatorData.specialties.includes(label) ? "2px solid var(--primary)" : "1px solid var(--border-color)",
                            background: operatorData.specialties.includes(label) ? "rgba(56, 189, 248, 0.12)" : "transparent",
                            padding: "10px 12px",
                            cursor: "pointer",
                            color: "var(--text-heading)",
                            textAlign: "center"
                          }}
                          >
                            {t('registerSpecialty' + label, label)}
                          </button>
                      ))}
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                    <label style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "0.85rem", color: "var(--text-muted)" }}>
                      {t('regLabelMaxGroup', 'Capacidad máxima de grupo')}
                      <input type="number" min="2" value={operatorData.maxGroupSize} onChange={(e) => handleOperatorChange("maxGroupSize", Number(e.target.value))} style={{ padding: "12px", borderRadius: "12px", border: "1px solid var(--border-color)", outline: "none" }} />
                    </label>
                    <label style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "0.85rem", color: "var(--text-muted)" }}>
                      {t('regLabelPayoutAccount', 'Cuenta de pagos')}
                      <input type="text" value={operatorData.payoutAccount} onChange={(e) => handleOperatorChange("payoutAccount", e.target.value)} placeholder={t('regPhPayoutAccount', 'MercadoPago / Banco')} style={{ padding: "12px", borderRadius: "12px", border: "1px solid var(--border-color)", outline: "none" }} />
                    </label>
                  </div>

                  <label style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "0.85rem", color: "var(--text-muted)" }}>
                    {t('regLabelCompanyPresentation', 'Presentación de la empresa')}
                    <textarea value={operatorData.description} onChange={(e) => handleOperatorChange("description", e.target.value)} rows={4} placeholder={t('regPhCompanyPresentation', 'Describe tu propuesta de valor, experiencia y tipo de clientes a los que atiendes.')} style={{ padding: "12px", borderRadius: "12px", border: "1px solid var(--border-color)", outline: "none" }} />
                  </label>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                    <label style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "0.85rem", color: "var(--text-muted)" }}>
                      {t('regLabelOpPassword', 'Contraseña')}
                      <input type="password" value={operatorData.password} onChange={(e) => handleOperatorChange("password", e.target.value)} placeholder="********" style={{ padding: "12px", borderRadius: "12px", border: "1px solid var(--border-color)", outline: "none" }} />
                    </label>
                    <label style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "0.85rem", color: "var(--text-muted)" }}>
                      {t('regLabelOpRepeatPassword', 'Repite contraseña')}
                      <input type="password" value={operatorData.confirmPassword} onChange={(e) => handleOperatorChange("confirmPassword", e.target.value)} placeholder="********" style={{ padding: "12px", borderRadius: "12px", border: "1px solid var(--border-color)", outline: "none" }} />
                    </label>
                  </div>
                </>
              )}

              <button type="submit" className="btn btn-primary" style={{ width: "100%", padding: "14px 18px", fontSize: "0.95rem" }}>
                {activeType === "customer" ? t('regCreateCustomer', 'Crear cuenta de cliente') : t('regRegisterOperator', 'Registrar operador turístico')}
              </button>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
}
