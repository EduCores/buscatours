import React from "react";
import * as Icons from "lucide-react";

export default function TourSidebarWidgets({
  tour, weather, windSpeed, windSpeedOverride, setWindSpeedOverride,
  checkedItems, setCheckedItems, tText
}) {
  const WeatherIcon = Icons[weather.icon] || Icons.CloudSun;

  // Dynamic packing list based on date & conditions
  const packList = [
    tText('tdPackTechBag', 'Mochila técnica (20L)'),
    tText('tdPackBottle', 'Botella de agua recargable (1.5L)'),
    tText('tdPackShoes', 'Calzado de trekking impermeabilizado')
  ];

  if (windSpeed > 70) {
    packList.push(tText('tdPackPoles', 'Bastones de marcha (Viento Extremo ⚠️)'));
    packList.push(tText('tdPackGlasses', 'Gafas protectoras contra viento & gravilla'));
    packList.push(tText('tdPackJacket', 'Chaqueta impermeable rígida (3ra Capa)'));
  } else if (windSpeed > 40) {
    packList.push(tText('tdPackWindJacket', 'Corta viento grueso & gorro térmico'));
    packList.push(tText('tdPackNeck', 'Cuello de abrigo de polar (buff)'));
  } else {
    packList.push(tText('tdPackLight', 'Corta viento liviano o polar fino'));
    packList.push(tText('tdPackSunscreen', 'Lentes de sol & protector solar factor 50'));
  }

  const tempNum = parseInt(weather.temp, 10);
  if (!isNaN(tempNum)) {
    if (tempNum <= 5) {
      packList.push(tText('tdPackGloves', 'Guantes térmicos impermeables'));
      packList.push(tText('tdPackHand', 'Calentadores de manos químicos'));
      packList.push(tText('tdPackBase', 'Camiseta térmica (Primera Capa)'));
    } else if (tempNum >= 30) {
      packList.push(tText('tdPackCap', 'Gorra ligera ventilada & sales de hidratación'));
      packList.push(tText('tdPackUV', 'Ropa técnica transpirable con filtro UV'));
    }
  }

  const checkedCount = packList.filter((item) => checkedItems[item]).length;
  const totalCount = packList.length;
  const percent = Math.round((checkedCount / totalCount) * 100);

  return (
    <>
      {/* Parametric Weather Guarantee Widget */}
      <div
        className="glass-card animate-hover-lift"
        style={{
          borderRadius: "var(--radius-md)",
          padding: "24px",
          border: "1px solid var(--border-color)",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          boxShadow: "var(--shadow-md)"
        }}
      >
        <h4 style={{ fontSize: "0.92rem", fontWeight: 800, color: "var(--text-heading)", display: "flex", alignItems: "center", gap: "8px" }}>
          <Icons.CloudRain size={16} style={{ color: "#38bdf8" }} /> {tText('tdParamWeather', 'Garantía Climática Paramétrica')}
        </h4>
        <p style={{ fontSize: "0.76rem", color: "var(--text-muted)", lineHeight: "1.4" }}>
          {tText('tdGuaranteeIntro', 'Seguro de reembolso directo de Busca Tours. Si el viento excede los')} <strong>70 km/h</strong> {tText('tdGuaranteeIn', 'en')} {tour.location.split(",")[0]}, {tText('tdGuaranteeOutro', 'se activa la cancelación automática con 100% de reembolso.')}
        </p>

        <div style={{
          backgroundColor: "rgba(0,0,0,0.02)",
          padding: "12px",
          borderRadius: "8px",
          border: "1px solid var(--border-color)"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", marginBottom: "6px" }}>
            <span>{tText('tdSimulatedWind', 'Viento Simulado:')}</span>
            <strong style={{ color: windSpeed > 70 ? "#ef4444" : "#22c55e" }}>{windSpeed} km/h</strong>
          </div>
          <input
            type="range"
            min="10"
            max="100"
            value={windSpeed}
            onChange={(e) => setWindSpeedOverride(Number(e.target.value))}
            style={{ width: "100%", cursor: "pointer", height: "4px", backgroundColor: "var(--border-color)", borderRadius: "2px" }}
          />

          {windSpeed > 70 ? (
            <div style={{ display: "flex", gap: "6px", alignItems: "center", marginTop: "8px", color: "#ef4444", fontSize: "0.72rem", fontWeight: 700 }}>
              <Icons.AlertCircle size={12} /> {tText('tdAutoRefund', '⚠️ Reembolso Automático 100% Habilitado.')}
            </div>
          ) : (
            <div style={{ display: "flex", gap: "6px", alignItems: "center", marginTop: "8px", color: "#22c55e", fontSize: "0.72rem", fontWeight: 700 }}>
              <Icons.CheckCircle size={12} /> {tText('tdOperatingNormally', 'Operando con normalidad')} ({weather.temp}).
            </div>
          )}
        </div>
      </div>

      {/* Smart Pack List Widget */}
      <div
        className="glass-card animate-hover-lift"
        style={{
          borderRadius: "var(--radius-md)",
          padding: "24px",
          border: "1px solid var(--border-color)",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          boxShadow: "var(--shadow-md)"
        }}
      >
        <h4 style={{ fontSize: "0.92rem", fontWeight: 800, color: "var(--text-heading)", display: "flex", alignItems: "center", gap: "8px" }}>
          <Icons.Sparkles size={16} style={{ color: "var(--accent)" }} /> {tText('tdSmartPack', 'Smart Pack List (Equipo Sugerido)')}
        </h4>
        <p style={{ fontSize: "0.76rem", color: "var(--text-muted)", lineHeight: "1.4", margin: 0 }}>
          {tText('tdPackDesc', 'Organiza tu mochila en tiempo real. Esta lista interactiva se adapta al clima, viento')} ({windSpeed} km/h) {tText('tdPackDesc2', 'y temperatura')} ({weather.temp}) {tText('tdGuaranteeIn', 'en')} {tour.location.split(",")[0]}.
        </p>

        <div style={{ marginTop: "4px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.72rem", color: "var(--text-muted)", marginBottom: "4px" }}>
            <span>{tText('tdPackProgress', 'Progreso:')} {checkedCount} {tText('tdPackOf', 'de')} {totalCount} {tText('tdPackItems', 'artículos')}</span>
            <strong>{percent}%</strong>
          </div>
          <div style={{ width: "100%", height: "6px", backgroundColor: "rgba(255,255,255,0.1)", borderRadius: "3px", overflow: "hidden" }}>
            <div style={{
              width: `${percent}%`,
              height: "100%",
              backgroundColor: percent === 100 ? "#22c55e" : "var(--primary)",
              transition: "width 0.3s ease, background-color 0.3s ease"
            }} />
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "10px", borderTop: "1px solid var(--border-color)", paddingTop: "12px", marginTop: "4px" }}>
          {packList.map((item, idx) => {
            const isChecked = !!checkedItems[item];
            return (
              <label
                key={idx}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  fontSize: "0.78rem",
                  color: isChecked ? "var(--text-muted)" : "var(--text-main)",
                  cursor: "pointer",
                  userSelect: "none"
                }}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => setCheckedItems((prev) => ({ ...prev, [item]: !prev[item] }))}
                  style={{ accentColor: "var(--primary)", width: "15px", height: "15px", cursor: "pointer" }}
                />
                <span style={{ textDecoration: isChecked ? "line-through" : "none", transition: "color 0.2s" }}>
                  {item}
                </span>
              </label>
            );
          })}
        </div>

        {percent === 100 && (
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            backgroundColor: "rgba(34,197,94,0.12)",
            border: "1px solid rgba(34,197,94,0.3)",
            padding: "10px 12px",
            borderRadius: "6px",
            color: "#4ade80",
            fontSize: "0.72rem",
            fontWeight: 700,
            marginTop: "8px",
            animation: "pulse 2s infinite"
          }}>
            <Icons.CheckCircle size={16} style={{ color: "#22c55e" }} />
            <span>{tText('tdPackReady', '🎒 ¡Mochila lista y equipada para la aventura!')}</span>
          </div>
        )}
      </div>

      {/* Carbon Footprint Calculator Widget */}
      <div
        className="glass-card animate-hover-lift"
        style={{
          borderRadius: "var(--radius-md)",
          padding: "24px",
          border: "1px solid var(--border-color)",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          boxShadow: "var(--shadow-md)"
        }}
      >
        <h4 style={{ fontSize: "0.92rem", fontWeight: 800, color: "var(--text-heading)", display: "flex", alignItems: "center", gap: "8px" }}>
          <Icons.Leaf size={16} style={{ color: "#10b981" }} /> {tText('tdCarbon', 'Huella de Carbono Estimada')}
        </h4>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "4px 0" }}>
          <span style={{ fontSize: "0.76rem", color: "var(--text-muted)" }}>{tText('tdEcoImpact', 'Impacto ecológico del tour:')}</span>
          <span style={{ fontSize: "1rem", fontWeight: 800, color: "#10b981", whiteSpace: "nowrap" }}>
            {tour.durationHours ? Math.round(tour.durationHours * 0.6 + 3) : 12} kg CO₂
          </span>
        </div>
        <p style={{ fontSize: "0.72rem", color: "var(--text-muted)", lineHeight: "1.3" }}>
          {tText('tdCarbonDesc', 'Aporta $1.50 USD en el paso de pago para compensar este impacto plantando árboles nativos con Reforestemos LATAM.')}
        </p>
      </div>
    </>
  );
}
