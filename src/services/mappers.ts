// Centralized mapping between the database (UPPERCASE enums) and the UI (Spanish labels).
// Extracted from dataService.ts to remove duplication.

export const CATEGORY_MAP_TO_DB: Record<string, string> = {
  Outdoor: "OUTDOOR",
  Relaxación: "RELAXACION",
  Feriado: "FERIADO",
  Temporada: "TEMPORADA",
  Salvaje: "SALVAJE",
  Aventura: "AVENTURA",
  Temático: "TEMATICO",
  Cultural: "CULTURAL",
  Ciudad: "CIUDAD",
  Montaña: "MONTANA",
  Glaciar: "GLACIAR",
  Lujo: "LUJO",
  Histórico: "HISTORICO",
  Familiar: "FAMILIAR",
  Selva: "SELVA",
  "Full Day": "FULLDAY",
  Navegación: "NAVEGACION",
};

export const CATEGORY_MAP_FROM_DB: Record<string, string> = {
  OUTDOOR: "Outdoor",
  RELAXACION: "Relaxación",
  FERIADO: "Feriado",
  TEMPORADA: "Temporada",
  SALVAJE: "Salvaje",
  AVENTURA: "Aventura",
  TEMATICO: "Temático",
  CULTURAL: "Cultural",
  CIUDAD: "Ciudad",
  MONTANA: "Montaña",
  GLACIAR: "Glaciar",
  LUJO: "Lujo",
  HISTORICO: "Histórico",
  FAMILIAR: "Familiar",
  SELVA: "Selva",
  FULLDAY: "Full Day",
  NAVEGACION: "Navegación",
};

export function mapCategoryToDb(cat: string): string {
  return CATEGORY_MAP_TO_DB[cat] || "OUTDOOR";
}
export function mapCategoryFromDb(cat: string): string {
  return CATEGORY_MAP_FROM_DB[cat] || cat || "Outdoor";
}

export const DESTINATION_MAP_TO_DB: Record<string, string> = {
  Argentina: "ARGENTINA",
  Perú: "PERU",
  Peru: "PERU",
  Bolivia: "BOLIVIA",
  Brasil: "BRAZIL",
  Brazil: "BRAZIL",
  Colombia: "COLOMBIA",
  Ecuador: "ECUADOR",
  Chile: "CHILE",
  México: "MEXICO",
  Mexico: "MEXICO",
  "República Dominicana": "DOMINICAN_REPUBLIC",
  "Dominican Republic": "DOMINICAN_REPUBLIC",
};

export const DESTINATION_MAP_FROM_DB: Record<string, string> = {
  ARGENTINA: "Argentina",
  PERU: "Perú",
  BOLIVIA: "Bolivia",
  BRAZIL: "Brasil",
  COLOMBIA: "Colombia",
  ECUADOR: "Ecuador",
  CHILE: "Chile",
  MEXICO: "México",
  DOMINICAN_REPUBLIC: "República Dominicana",
};

export function mapDestinationToDb(dest: string): string {
  return DESTINATION_MAP_TO_DB[dest] || "ARGENTINA";
}
export function mapDestinationFromDb(dest: string): string {
  return DESTINATION_MAP_FROM_DB[dest] || dest || "Argentina";
}

// --- Status enums: UI uses Spanish labels, the schema requires codes. ---

const GUIDE_STATUS_TO_DB: Record<string, string> = {
  disponible: "DISPONIBLE",
  "en tour": "EN_TOUR",
  "en tour activo": "EN_TOUR",
  offline: "OFFLINE",
  "offline / licencia": "OFFLINE",
};
const GUIDE_STATUS_FROM_DB: Record<string, string> = {
  DISPONIBLE: "Disponible",
  EN_TOUR: "En tour",
  OFFLINE: "Offline",
};

const VEHICLE_STATUS_TO_DB: Record<string, string> = {
  disponible: "DISPONIBLE",
  "en uso": "EN_USO",
  "en ruta activa": "EN_USO",
  offline: "OFFLINE",
  mantenimiento: "OFFLINE",
};
const VEHICLE_STATUS_FROM_DB: Record<string, string> = {
  DISPONIBLE: "Disponible",
  EN_USO: "En uso",
  OFFLINE: "Offline",
};

const BOOKING_STATUS_TO_DB: Record<string, string> = {
  confirmada: "CONFIRMED",
  pendiente: "PENDING",
  cancelada: "CANCELLED",
  completado: "COMPLETED",
};
const BOOKING_STATUS_FROM_DB: Record<string, string> = {
  CONFIRMED: "Confirmada",
  PENDING: "Pendiente",
  CANCELLED: "Cancelada",
  COMPLETED: "Completado",
};

function normalizeEnum(
  value: string | undefined,
  toDb: Record<string, string>,
  validPattern: RegExp
): string {
  const s = (value || "").toLowerCase();
  if (toDb[s]) return toDb[s];
  const upper = (value || "").toUpperCase();
  return validPattern.test(upper) ? upper : Object.values(toDb)[0];
}

function denormalizeEnum(
  value: string | undefined,
  fromDb: Record<string, string>,
  fallback: string
): string {
  const upper = (value || "").toUpperCase();
  return fromDb[upper] || value || fallback;
}

export function normalizeGuideStatus(s?: string): string {
  return normalizeEnum(s, GUIDE_STATUS_TO_DB, /^(DISPONIBLE|EN_TOUR|OFFLINE)$/);
}
export function denormalizeGuideStatus(s?: string): string {
  return denormalizeEnum(s, GUIDE_STATUS_FROM_DB, "Disponible");
}
export function normalizeVehicleStatus(s?: string): string {
  return normalizeEnum(s, VEHICLE_STATUS_TO_DB, /^(DISPONIBLE|EN_USO|OFFLINE)$/);
}
export function denormalizeVehicleStatus(s?: string): string {
  return denormalizeEnum(s, VEHICLE_STATUS_FROM_DB, "Disponible");
}
export function normalizeBookingStatus(s?: string): string {
  return normalizeEnum(s, BOOKING_STATUS_TO_DB, /^(CONFIRMED|PENDING|CANCELLED|COMPLETED)$/);
}
export function denormalizeBookingStatus(s?: string): string {
  return denormalizeEnum(s, BOOKING_STATUS_FROM_DB, "Pendiente");
}

// Role normalization shared between AuthContext and dataService.
export function normalizeDbRole(role?: string | null): string {
  const r = (role || "").toUpperCase().replace(/-/g, "_");
  switch (r) {
    case "PLATFORM_ADMIN":
      return "platform-admin";
    case "TOUR_ADMIN":
      return "tour-admin";
    case "OPERATOR":
      return "operator";
    default:
      return "customer";
  }
}

export function parseTranslations(raw: unknown): Record<string, Record<string, string>> {
  if (!raw) return {};
  if (typeof raw === "string") {
    try {
      const parsed = JSON.parse(raw);
      return parsed && typeof parsed === "object" ? (parsed as Record<string, Record<string, string>>) : {};
    } catch {
      return {};
    }
  }
  if (typeof raw === "object") return raw as Record<string, Record<string, string>>;
  return {};
}

export function parseHeroImages(raw: unknown): string[] {
  if (typeof raw === "string") {
    const trimmed = raw.trim();
    if (!trimmed) return [];
    try {
      const parsed = JSON.parse(trimmed);
      return Array.isArray(parsed) ? parsed.filter(Boolean) : [trimmed];
    } catch {
      return trimmed.split(",").map((s) => s.trim()).filter(Boolean);
    }
  }
  if (Array.isArray(raw)) return raw.filter(Boolean);
  return [];
}

export const isUuid = (value: unknown): boolean =>
  typeof value === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
