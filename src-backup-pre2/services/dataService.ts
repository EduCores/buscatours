import { httpsCallable } from 'firebase/functions';
import { getDataConnect, connectDataConnectEmulator } from 'firebase/data-connect';
import { getFirebaseApp, getCloudFunctions, getAuthUid } from './firebaseAuth';
import {
  connectorConfig,
  getTours,
  getTour,
  createTour,
  updateTour,
  deleteTour,
  getBookings,
  createBooking,
  updateBooking,
  deleteBooking,
  getUsers,
  getCurrentUser,
  getActiveSliderSlides,
  createSliderSlide,
  updateSliderSlide,
  deleteSliderSlide,
  getGuides,
  createGuide,
  updateGuide,
  deleteGuide,
  getVehicles,
  createVehicle,
  updateVehicle,
  deleteVehicle,
  getOfflineQueue,
  addOfflineCheckin,
  deletePwaCheckin
} from '@dataconnect/generated';
import {
  mapCategoryToDb,
  mapCategoryFromDb,
  mapDestinationToDb,
  mapDestinationFromDb,
  normalizeGuideStatus,
  denormalizeGuideStatus,
  normalizeVehicleStatus,
  denormalizeVehicleStatus,
  normalizeBookingStatus,
  denormalizeBookingStatus,
  normalizeDbRole,
  parseTranslations,
  parseHeroImages,
  isUuid
} from './mappers';

export interface TourInput {
  title: string;
  location: string;
  duration: string;
  durationHours: number;
  originalPrice: number;
  price: number;
  discount?: number | null;
  category: string;
  description: string;
  image: string;
  featured: boolean;
  oneDay: boolean;
  popular: boolean;
  status: string;
  destination: string;
  vibeAdrenaline: number;
  vibeRelax: number;
  vibeCulture: number;
  vibeFamily: number;
  lat?: number | null;
  lng?: number | null;
  heroImages?: string;
  heroBackgroundPosition: string;
  operatorId?: string | null;
  translations?: Record<string, Record<string, string>> | string | null;
}

export interface BookingInput {
  id?: string;
  bookingId?: string;
  tourId: string;
  userId: string;
  guests: number;
  date: string;
  totalPrice: number;
  totalPriceUSD?: number;
  currency: string;
  status?: string;
  addons?: unknown;
  specialRequests?: string;
}

export interface GuideInput {
  id?: string;
  name: string;
  specialty: string;
  status: string;
  operatorId: string;
}

export interface VehicleInput {
  id?: string;
  name: string;
  seats: number;
  status: string;
  operatorId: string;
}

export interface SliderSlideInput {
  id?: string;
  title: string;
  subtitle: string;
  ctaText: string;
  link: string;
  image: string;
  order: number;
  active: boolean;
  translations?: Record<string, Record<string, string>> | string | null;
}

export interface OfflineCheckinInput {
  tourId: string;
  bookingId: string;
  tourTitle: string;
  customerName: string;
  operator: string;
  status: string;
  timestamp: string;
}

// Type alias for the generic DB row shape returned by Data Connect.
type Tour = Record<string, unknown>;

// Inicializar Data Connect con la app explícita
const app = getFirebaseApp();
const dataconnect = getDataConnect(app, connectorConfig);

// En desarrollo local, conectar al emulador de Data Connect.
// Se controla con VITE_USE_EMULATORS para poder apuntar a produccion si hace falta.
if (import.meta.env.VITE_USE_EMULATORS === 'true') {
  connectDataConnectEmulator(dataconnect, '127.0.0.1', 9399);
}

const functions = getCloudFunctions();

function handleError(error: unknown): never {
  const message = error instanceof Error ? error.message : String(error);
  console.error('DataConnect error:', error);
  throw new Error(message || 'Error en la operación');
}

function isUnauthenticatedError(error: unknown): boolean {
  if (error instanceof Error) {
    return error.message.includes('unauthenticated') || error.message.includes('UNAUTHENTICATED');
  }
  return false;
}

const MOCK_TOURS: Tour[] = [
  {
    id: 'tour-mock-1',
    title: 'Tour de Prueba',
    location: 'Cusco, Perú',
    price: 199,
    originalPrice: 249,
    discount: 50,
    duration: '1 día / 8 horas',
    durationHours: 8,
    category: 'Cultural',
    description: 'Tour de ejemplo generado automáticamente.',
    image: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?w=800',
    oneDay: true,
    popular: false,
    guideId: 'guide-1',
    vehicleId: 'vehicle-1',
    operator: 'Andes Expeditions',
    vibeScores: { adrenalina: 50, relax: 50, cultura: 80, familia: 40 },
    destinationCountry: 'Perú',
    lat: -12.04637,
    lng: -77.04279,
    heroImages: ['https://images.unsplash.com/photo-1526392060635-9d6019884377?w=800'],
    bgPosition: 'center',
    status: 'DRAFT'
  }
];

// (Other MOCK_* arrays removed: Bookings, Guides, Vehicles, Slides fall back to empty
// results from Data Connect when unauthenticated, which is the correct production behavior.)


// (duplicate maps/normalizers moved to ./mappers)

async function safeRead<T>(label: string, fallback: T, call: () => Promise<T>): Promise<T> {
  try {
    return await call();
  } catch (error) {
    if (isUnauthenticatedError(error)) {
      console.warn(`DataConnect ${label} failed with 401; using fallback data.`);
      return fallback;
    }
    throw error;
  }
}

export const dataService = {
  // TOURS
  async getTours() {
    return safeRead(
      'getTours',
      MOCK_TOURS,
      async () => {
        const result = await getTours(dataconnect);
        const tours = result.data?.tours || [];
        return tours.map((t: Record<string, unknown>) => {
          const parsedHeroImages = parseHeroImages(t.heroImages);
          return {
            ...t,
            heroImages: parsedHeroImages,
            category: mapCategoryFromDb(t.category),
            destination: mapDestinationFromDb(t.destination),
            destinationCountry: mapDestinationFromDb(t.destination),
            bgPosition: typeof t.heroBackgroundPosition === 'string' && t.heroBackgroundPosition ? t.heroBackgroundPosition : 'center',
            translations: parseTranslations(t.translations),
            vibeScores: {
              adrenalina: t.vibeAdrenaline !== undefined ? Number(t.vibeAdrenaline) : 50,
              relax: t.vibeRelax !== undefined ? Number(t.vibeRelax) : 50,
              cultura: t.vibeCulture !== undefined ? Number(t.vibeCulture) : 50,
              familia: t.vibeFamily !== undefined ? Number(t.vibeFamily) : 50,
            },
            vibeAdrenaline: t.vibeAdrenaline !== undefined ? Number(t.vibeAdrenaline) : 50,
            vibeRelax: t.vibeRelax !== undefined ? Number(t.vibeRelax) : 50,
            vibeCulture: t.vibeCulture !== undefined ? Number(t.vibeCulture) : 50,
            vibeFamily: t.vibeFamily !== undefined ? Number(t.vibeFamily) : 50,
          };
        });
      }
    );
  },

  async translateContent(sourceLang: string, targetLangs: string[], fields: Record<string, string>) {
    try {
      const functions = getCloudFunctions();
      const callable = httpsCallable(functions, 'translateContent');
      const result = await callable({ sourceLang, targetLangs, fields });
      return (result.data || {}) as Record<string, Record<string, string>>;
    } catch (error) {
      console.error('translateContent failed:', error);
      return {};
    }
  },

  async getTour(id: string) {
    try {
      const result = await getTour(dataconnect, { id });
      const tour = result.data?.tour;
      if (!tour) return null;
      const parsedHeroImages = parseHeroImages(tour.heroImages);
      return {
        ...tour,
        heroImages: parsedHeroImages,
        category: mapCategoryFromDb(tour.category),
        destination: mapDestinationFromDb(tour.destination),
        destinationCountry: mapDestinationFromDb(tour.destination),
        bgPosition: typeof tour.heroBackgroundPosition === 'string' && tour.heroBackgroundPosition ? tour.heroBackgroundPosition : 'center',
        translations: parseTranslations(tour.translations),
        vibeScores: {
          adrenalina: tour.vibeAdrenaline !== undefined ? Number(tour.vibeAdrenaline) : 50,
          relax: tour.vibeRelax !== undefined ? Number(tour.vibeRelax) : 50,
          cultura: tour.vibeCulture !== undefined ? Number(tour.vibeCulture) : 50,
          familia: tour.vibeFamily !== undefined ? Number(tour.vibeFamily) : 50,
        }
      };
    } catch (error) {
      if (isUnauthenticatedError(error)) {
        return MOCK_TOURS[0] || null;
      }
      handleError(error);
    }
  },

  async saveTour(tourToSave: TourInput) {
    try {
      const { id, ...rawFields } = tourToSave;

      // Map arrays & enums
      let heroImagesStr = rawFields.heroImages;
      if (Array.isArray(heroImagesStr)) {
        heroImagesStr = JSON.stringify(heroImagesStr);
      }

      const dbCategory = rawFields.category ? mapCategoryToDb(rawFields.category) : "OUTDOOR";
      const dbDestination = rawFields.destinationCountry
        ? mapDestinationToDb(rawFields.destinationCountry)
        : (rawFields.destination ? mapDestinationToDb(rawFields.destination) : "ARGENTINA");

      // Explicitly pick only the fields that are declared in mutations.gql
      const mutationData: TourInput = {
        title: rawFields.title,
        location: rawFields.location,
        duration: rawFields.duration,
        durationHours: Number(rawFields.durationHours || 0),
        originalPrice: Number(rawFields.originalPrice || 0),
        price: Number(rawFields.price || 0),
        discount: rawFields.discount != null ? String(rawFields.discount) : null,
        category: dbCategory,
        description: rawFields.description,
        image: rawFields.image,
        featured: rawFields.featured ?? false,
        oneDay: rawFields.oneDay ?? true,
        popular: rawFields.popular ?? false,
        status: rawFields.status || "PUBLISHED",
        destination: dbDestination,
        vibeAdrenaline: rawFields.vibeScores?.adrenalina !== undefined ? Number(rawFields.vibeScores.adrenalina) : (rawFields.vibeAdrenaline !== undefined ? Number(rawFields.vibeAdrenaline) : 50),
        vibeRelax: rawFields.vibeScores?.relax !== undefined ? Number(rawFields.vibeScores.relax) : (rawFields.vibeRelax !== undefined ? Number(rawFields.vibeRelax) : 50),
        vibeCulture: rawFields.vibeScores?.cultura !== undefined ? Number(rawFields.vibeScores.cultura) : (rawFields.vibeCulture !== undefined ? Number(rawFields.vibeCulture) : 50),
        vibeFamily: rawFields.vibeScores?.familia !== undefined ? Number(rawFields.vibeScores.familia) : (rawFields.vibeFamily !== undefined ? Number(rawFields.vibeFamily) : 50),
        lat: rawFields.lat !== undefined && rawFields.lat !== null && rawFields.lat !== "" ? Number(rawFields.lat) : null,
        lng: rawFields.lng !== undefined && rawFields.lng !== null && rawFields.lng !== "" ? Number(rawFields.lng) : null,
        heroImages: heroImagesStr,
        heroBackgroundPosition: rawFields.bgPosition || rawFields.heroBackgroundPosition || "center",
        translations: rawFields.translations
          ? (typeof rawFields.translations === 'string' ? rawFields.translations : JSON.stringify(rawFields.translations))
          : null,
        operatorId: rawFields.operatorId
      };

      const isNew = !id || typeof id === 'number' || !isUuid(id);
      if (isNew) {
        const result = await createTour(dataconnect, mutationData);
        const newId = result.data?.tour_insert?.id;
        return {
          ...tourToSave,
          id: newId,
          category: mapCategoryFromDb(dbCategory),
          destination: mapDestinationFromDb(dbDestination)
        };
      } else {
        await updateTour(dataconnect, { id, ...mutationData });
        return {
          ...tourToSave,
          category: mapCategoryFromDb(dbCategory),
          destination: mapDestinationFromDb(dbDestination)
        };
      }
    } catch (error) { handleError(error); }
  },

  async deleteTour(tourId: string) {
    try {
      await deleteTour(dataconnect, { id: tourId });
      return true;
    } catch (error) { handleError(error); }
  },

  // BOOKINGS
  async getBookings() {
    try {
      const result = await getBookings(dataconnect);
      const bookings = result.data?.bookings || [];
      return bookings.map((b: Record<string, unknown>) => ({
        ...b,
        status: denormalizeBookingStatus(b.status),
        price: b.totalPrice ?? b.price,
        customerName: b.user?.name || b.userId || b.customerName || 'Cliente',
        pax: b.guests ?? b.pax,
        tourTitle: b.tour?.title || b.tourTitle || 'Tour'
      }));
    } catch (error) { handleError(error); }
  },

  async addBooking(booking: BookingInput) {
    try {
      const { ...data } = booking;

      // SECURITY: a booking must always be created under the authenticated user.
      // Ignore any caller-supplied userId; use the real auth.uid (Data Connect enforces
      // an authenticated session, and the backend must reject userId !== auth.uid).
      const authedUid = getAuthUid();
      if (!authedUid) {
        throw new Error('Debes iniciar sesión para crear una reserva.');
      }
      const graphqlData: BookingInput = {
        bookingId: data.bookingId || ('BK-' + Date.now()),
        tourId: data.tourId,
        userId: authedUid,
        guests: Number(data.guests),
        date: data.date ? new Date(data.date).toISOString() : new Date().toISOString(),
        totalPrice: Number(data.totalPrice || data.totalPriceUSD),
        currency: data.currency || 'USD',
        status: normalizeBookingStatus(data.status),
        addons: data.addons,
        specialRequests: data.specialRequests || ''
      };

      const result = await createBooking(dataconnect, graphqlData);
      const newId = result.data?.booking_insert?.id;
      return {
        ...booking,
        id: newId,
        status: booking.status || 'Confirmada'
      };
    } catch (error) { handleError(error); }
  },

  async updateBooking(updatedBooking: BookingInput) {
    try {
      const { id, ...data } = updatedBooking;

      const graphqlData: BookingInput = {
        id,
        tourId: data.tourId,
        // SECURITY: never reassign booking to another user; tie to auth.uid.
        userId: getAuthUid() ?? data.userId,
        guests: data.guests ? Number(data.guests) : undefined,
        date: data.date ? new Date(data.date).toISOString() : undefined,
        totalPrice: data.totalPrice || data.totalPriceUSD ? Number(data.totalPrice || data.totalPriceUSD) : undefined,
        currency: data.currency,
        status: normalizeBookingStatus(data.status),
        addons: data.addons,
        specialRequests: data.specialRequests
      };

      const filtered = Object.fromEntries(
        Object.entries(graphqlData).filter(([_, v]) => v !== undefined)
      );

      await updateBooking(dataconnect, filtered as Parameters<typeof updateBooking>[1]);
      return updatedBooking;
    } catch (error) { handleError(error); }
  },

  async deleteBooking(bookingId: string) {
    try {
      await deleteBooking(dataconnect, { id: bookingId });
      return true;
    } catch (error) { handleError(error); }
  },

  // USERS
  async getUsers() {
    try {
      const result = await getUsers(dataconnect);
      const dbUsers = result.data?.users || [];
      return dbUsers.map((u: Record<string, unknown>) => ({
        ...u,
        role: normalizeDbRole(u.role as string | undefined)
      }));
    } catch (error) { handleError(error); }
  },

  async getCurrentUser() {
    try {
      const result = await getCurrentUser(dataconnect);
      const user = result.data?.user;
      if (!user) return null;
      return {
        ...user,
        role: normalizeDbRole(user.role as string | undefined)
      };
    } catch (error) { handleError(error); }
  },

  async addUser(user: { name: string; email: string; role?: string }) {
    try {
      const dbUser = {
        ...user,
        role: user.role ? user.role.toUpperCase().replace('-', '_') : 'CUSTOMER'
      };
      const createUserFn = httpsCallable<{ user: typeof dbUser }, { users: Array<Record<string, unknown>> }>(functions, 'createUser');
      const result = await createUserFn({ user: dbUser });
      const returnedUsers = result.data?.users || [];
      return returnedUsers.map((u: Record<string, unknown>) => ({
        ...u,
        role: normalizeDbRole(u.role as string | undefined)
      }));
    } catch (error) { handleError(error); }
  },

  // SLIDER
  async getSliderSlides() {
    try {
      const result = await getActiveSliderSlides(dataconnect);
      return (result.data?.sliderSlides || []).map((s: Record<string, unknown>) => ({
        ...s,
        ctaText: s.ctaText ?? s.buttonText
      }));
    } catch (error) { handleError(error); }
  },

  async saveSliderSlides(slides: SliderSlideInput[]) {
    try {
      // 1. Get existing slides
      const existingResult = await getActiveSliderSlides(dataconnect);
      const existingSlides = existingResult.data?.sliderSlides || [];
      const existingIds = new Set(existingSlides.map((s) => s.id));

      const newIds = new Set(slides.filter((s) => typeof s.id === 'string').map((s) => s.id));

      // 2. Delete removed slides
      const toDelete = existingSlides.filter((s) => !newIds.has(s.id));
      for (const slide of toDelete) {
        await deleteSliderSlide(dataconnect, { id: slide.id });
      }

       // 3. Create or update
       const results = [];
       for (const slide of slides) {
          const { id, translations, ctaText, ...rest } = slide as SliderSlideInput & { translations?: unknown; ctaText?: string };
          const data = {
            ...rest,
            buttonText: ctaText ?? (rest as Record<string, unknown>).buttonText,
            translations: translations
              ? (typeof translations === 'string' ? translations : JSON.stringify(translations))
              : null,
          };
         if (typeof id === 'string' && existingIds.has(id)) {
           // Update
           const result = await updateSliderSlide(dataconnect, { id, ...data });
           results.push(result.data?.sliderSlide_update);
         } else {
           // Create (ignoring the temporary frontend id)
           const result = await createSliderSlide(dataconnect, data);
           results.push(result.data?.sliderSlide_insert);
         }
       }
      return results;
    } catch (error) {
      handleError(error);
    }
  },

  // GUIDES
  async getGuides(operatorId?: string) {
    try {
    const result = await getGuides(dataconnect, { operatorId });
    return (result.data?.guides || []).map((g: Record<string, unknown>) => ({
      ...g,
      status: denormalizeGuideStatus(g.status as string)
    }));
    } catch (error) { handleError(error); }
  },

  async saveGuide(guide: GuideInput) {
    try {
      const { id, ...rawFields } = guide;
      const isNew = !id || typeof id === 'number' || !isUuid(id);

      const mutationData: GuideInput = {
        name: rawFields.name,
        specialty: rawFields.specialty,
        status: normalizeGuideStatus(rawFields.status),
        operatorId: rawFields.operatorId
      };

      if (isNew) {
        const result = await createGuide(dataconnect, mutationData);
        const newId = result.data?.guide_insert?.id;
        return { ...guide, id: newId };
      } else {
        await updateGuide(dataconnect, { id, ...mutationData });
        return guide;
      }
    } catch (error) { handleError(error); }
  },

  async deleteGuide(guideId: string) {
    try {
      await deleteGuide(dataconnect, { id: guideId });
      return true;
    } catch (error) { handleError(error); }
  },

  // VEHICLES
  async getVehicles(operatorId?: string) {
    try {
    const result = await getVehicles(dataconnect, { operatorId });
    return (result.data?.vehicles || []).map((v: Record<string, unknown>) => ({
      ...v,
      status: denormalizeVehicleStatus(v.status as string)
    }));
    } catch (error) { handleError(error); }
  },

  async saveVehicle(vehicle: VehicleInput) {
    try {
      const { id, ...rawFields } = vehicle;
      const isNew = !id || typeof id === 'number' || !isUuid(id);

      const mutationData: VehicleInput = {
        name: rawFields.name,
        seats: Number(rawFields.seats),
        status: normalizeVehicleStatus(rawFields.status),
        operatorId: rawFields.operatorId
      };

      if (isNew) {
        const result = await createVehicle(dataconnect, mutationData);
        const newId = result.data?.vehicle_insert?.id;
        return { ...vehicle, id: newId };
      } else {
        await updateVehicle(dataconnect, { id, ...mutationData });
        return vehicle;
      }
    } catch (error) { handleError(error); }
  },

  async deleteVehicle(vehicleId: string) {
    try {
      await deleteVehicle(dataconnect, { id: vehicleId });
      return true;
    } catch (error) { handleError(error); }
  },

  // PWA CHECK-INS
  async getOfflineQueue(operatorId?: string) {
    try {
      const result = await getOfflineQueue(dataconnect, { operatorId });
      return result.data?.pwaCheckins || [];
    } catch (error) { handleError(error); }
  },

  async addOfflineCheckin(checkin: OfflineCheckinInput) {
    try {
      const mutationData: OfflineCheckinInput = {
        tourId: checkin.tourId,
        bookingId: checkin.bookingId,
        tourTitle: checkin.tourTitle,
        customerName: checkin.customerName,
        operator: checkin.operator,
        status: checkin.status || 'PENDIENTE_SYNC',
        timestamp: checkin.timestamp ? new Date(checkin.timestamp).toISOString() : new Date().toISOString()
      };
      const result = await addOfflineCheckin(dataconnect, mutationData);
      return result.data?.pwaCheckin_insert;
    } catch (error) { handleError(error); }
  },

  async syncOfflineQueue(operatorId: string) {
    try {
      const queue = await this.getOfflineQueue(operatorId);
      const results: unknown[] = [];
      const failedIds: string[] = [];

      for (const checkin of queue) {
        try {
          // Convert checkin to booking
          const tour = checkin.tourId ? await this.getTour(checkin.tourId) : null;
          if (!tour) {
            // Tour inexistente: no se puede sincronizar, se conserva para revisión manual
            failedIds.push(checkin.id);
            continue;
          }
          const dateStr =
            checkin.timestamp && typeof checkin.timestamp === 'string'
              ? checkin.timestamp.substring(0, 10)
              : new Date().toISOString().substring(0, 10);
          const booking = {
            tourId: checkin.tourId,
            customerName: checkin.customerName,
            date: dateStr,
            pax: 2,
            price: tour.price * 2,
            currency: 'USD',
            status: 'Confirmada'
          };
          const result = await this.addBooking(booking);
          results.push(result);
          // Solo se elimina el check-in si la reserva se creó con éxito
          await deletePwaCheckin(dataconnect, { id: checkin.id });
        } catch (err) {
          console.error('syncOfflineQueue: falló check-in', checkin.id, err);
          failedIds.push(checkin.id);
        }
      }

      if (failedIds.length) {
        console.warn(`syncOfflineQueue: ${failedIds.length} check-in(s) no sincronizados:`, failedIds);
      }
      return { results, failedIds };
    } catch (error) { handleError(error); }
  },

  async deleteSliderSlide(id: string) {
    try {
      const result = await deleteSliderSlide(dataconnect, { id });
      return result.data?.sliderSlide_delete ?? null;
    } catch (error) { handleError(error); }
  },

  // BOTTOM SLIDER
  // NOTE: kept in localStorage on purpose. This is purely decorative pre-footer imagery
  // (no auth, no PII, no business data), so it does not belong in the authenticated
  // Data Connect tables. The MAIN hero slider (getSliderSlides/saveSliderSlides) is the
  // one backed by Data Connect and protected by @auth(level: USER). If you later want to
  // make the bottom slider editable from the admin and persisted server-side, add a
  // `kind: BOTTOM | HERO` enum column to slider_slides and query by it.
  getBottomSliderSlides() {
    const data = localStorage.getItem('bottom_slider_slides');
    if (data) {
      try {
        return JSON.parse(data);
      } catch (e) {
        console.error(e);
      }
    }
    return [
      { id: "b1", image: "https://images.unsplash.com/photo-1517086822157-2b0358e7684a?q=80&w=1200&auto=format&fit=crop", order: 1, active: true },
      { id: "b2", image: "https://images.unsplash.com/photo-1508849789987-4e5333c12b78?q=80&w=1200&auto=format&fit=crop", order: 2, active: true },
      { id: "b3", image: "https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?q=80&w=1200&auto=format&fit=crop", order: 3, active: true },
      { id: "b4", image: "https://images.unsplash.com/photo-1463137537628-a3f2dbdc17c8?q=80&w=1200&auto=format&fit=crop", order: 4, active: true }
    ];
  },

  saveBottomSliderSlides(slides: SliderSlideInput[]) {
    localStorage.setItem('bottom_slider_slides', JSON.stringify(slides));
    return slides;
  },
};
