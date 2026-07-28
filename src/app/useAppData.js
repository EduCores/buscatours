import { useState, useEffect } from "react";
import { toursData } from "../data/tours";
import { dataService } from "../services/dataService";
import { ensureEmulatorUser } from "../services/firebaseAuth";
import { useTranslation } from "../i18n/LanguageContext";

const FALLBACK_USERS = [
  { id: "buscatours", name: "Busca Tours", role: "platform-admin", email: "admin@buscatours.com" },
  { id: "operator-01", name: "Andes Expeditions", role: "operator", email: "operador1@buscatours.com" },
  { id: "operator-02", name: "Patagonia Wild Outdoors", role: "operator", email: "operador2@buscatours.com" },
  { id: "tour-admin-01", name: "Admin de Contenido", role: "tour-admin", email: "editor@buscatours.com" },
  { id: "customer-01", name: "Cliente Frecuente", role: "customer", email: "cliente@buscatours.com" }
];

export function useAppData() {
  const { activeLanguage, setActiveLanguage } = useTranslation();

  const [toursList, setToursList] = useState(() => {
    const saved = localStorage.getItem("bt-tours");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Error parsing saved tours:", e);
      }
    }
    return toursData;
  });

  const [bookingsList, setBookingsList] = useState(() => {
    const saved = localStorage.getItem("bt-bookings");
    return saved ? JSON.parse(saved) : [];
  });

  const [availableUsers, setAvailableUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem("bt-current-user");
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const [theme, setTheme] = useState("dark-blue");
  const [ecoPoints, setEcoPoints] = useState(() => {
    const saved = localStorage.getItem("bt-eco-points");
    return saved ? Number(saved) : 0;
  });
  const [activeCurrency, setActiveCurrency] = useState("USD");
  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem("bt-wishlist");
    return saved ? JSON.parse(saved) : [];
  });

  // Version migration for localStorage caches
  useEffect(() => {
    if (localStorage.getItem("bt-version") !== "v4") {
      localStorage.removeItem("bt-tours");
      localStorage.removeItem("bt-slider");
      localStorage.setItem("bt-version", "v4");
      window.location.reload();
    }
  }, []);

  // Initial data load from DB
  useEffect(() => {
    const loadInitialData = async () => {
      try { await ensureEmulatorUser(); } catch (e) { /* ignore emulator auth errors */ }

      try {
        const users = await dataService.getUsers();
        setAvailableUsers(users && users.length > 0 ? users : FALLBACK_USERS);
      } catch (e) {
        console.error("Error loading users from DB, using fallback:", e);
        setAvailableUsers(FALLBACK_USERS);
      }

      try {
        const defaultUser = await dataService.getCurrentUser();
        setCurrentUser((prev) => {
          if (prev) return prev;
          if (defaultUser) return defaultUser;
          return FALLBACK_USERS[0];
        });
      } catch (e) {
        console.error("Error loading current user, using fallback:", e);
        setCurrentUser((prev) => prev || FALLBACK_USERS[0]);
      }

      try {
        const tours = await dataService.getTours();
        if (tours && tours.length > 0) {
          setToursList(tours);
        }
      } catch (e) {
        console.error("Error loading tours from DB:", e);
      }

      try {
        const bookings = await dataService.getBookings();
        setBookingsList(bookings && bookings.length > 0 ? bookings : []);
      } catch (e) {
        console.error("Error loading bookings from DB:", e);
        setBookingsList([]);
      }
    };
    loadInitialData();
  }, []);

  // Persist caches
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("bt-current-user", JSON.stringify(currentUser));
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem("bt-eco-points", String(ecoPoints));
  }, [ecoPoints]);

  useEffect(() => {
    localStorage.setItem("bt-wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    if (toursList && toursList.length > 0) {
      localStorage.setItem("bt-tours", JSON.stringify(toursList));
    }
  }, [toursList]);

  useEffect(() => {
    if (bookingsList && bookingsList.length > 0) {
      localStorage.setItem("bt-bookings", JSON.stringify(bookingsList));
    }
  }, [bookingsList]);

  useEffect(() => {
    document.body.classList.remove("dark", "dark-blue", "dark-yellow", "theme-nature-dark");
    if (theme !== "light") {
      document.body.classList.add(theme);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => {
      if (prev === "dark-blue") return "dark-yellow";
      if (prev === "dark-yellow") return "theme-nature-dark";
      return "dark-blue";
    });
  };

  return {
    toursList, setToursList,
    bookingsList, setBookingsList,
    availableUsers, setAvailableUsers,
    currentUser, setCurrentUser,
    theme, setTheme, toggleTheme,
    ecoPoints, setEcoPoints,
    activeCurrency, setActiveCurrency,
    activeLanguage, setActiveLanguage,
    wishlist, setWishlist
  };
}
