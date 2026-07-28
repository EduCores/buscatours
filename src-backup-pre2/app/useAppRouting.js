import { useState, useEffect } from "react";

const parseHash = (hash) => {
  if (hash.startsWith("#tour/")) {
    const id = hash.replace("#tour/", "");
    if (id) return { view: "detail", selectedTourId: id, selectedBookingId: null };
  }
  if (hash === "#admin") return { view: "admin", selectedTourId: null, selectedBookingId: null };
  if (hash === "#register") return { view: "register", selectedTourId: null, selectedBookingId: null };
  if (hash.startsWith("#pay/") && hash.endsWith("/split")) {
    const bookingId = hash.substring(5, hash.length - 6);
    return { view: "split-payment", selectedTourId: null, selectedBookingId: bookingId };
  }
  return { view: "home", selectedTourId: null, selectedBookingId: null };
};

export function useAppRouting() {
  const initial = typeof window !== "undefined" ? parseHash(window.location.hash) : { view: "home", selectedTourId: null, selectedBookingId: null };
  const [view, setView] = useState(initial.view);
  const [selectedTourId, setSelectedTourId] = useState(initial.selectedTourId);
  const [selectedBookingId, setSelectedBookingId] = useState(initial.selectedBookingId || null);

  // Sync back/forward navigation
  useEffect(() => {
    const handleHashChange = () => {
      const next = parseHash(window.location.hash);
      setView(next.view);
      setSelectedTourId(next.selectedTourId);
      setSelectedBookingId(next.selectedBookingId);
    };
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  // Reflect view in the URL hash
  useEffect(() => {
    if (view === "detail" && selectedTourId) {
      if (window.location.hash !== `#tour/${selectedTourId}`) window.location.hash = `#tour/${selectedTourId}`;
    } else if (view === "admin") {
      if (window.location.hash !== "#admin") window.location.hash = "#admin";
    } else if (view === "register") {
      if (window.location.hash !== "#register") window.location.hash = "#register";
    } else if (view === "split-payment" && selectedBookingId) {
      if (window.location.hash !== `#pay/${selectedBookingId}/split`) window.location.hash = `#pay/${selectedBookingId}/split`;
    } else if (view === "home") {
      const currentHash = window.location.hash;
      if (currentHash.startsWith("#tour/") || currentHash === "#admin" || currentHash.startsWith("#pay/")) {
        window.location.hash = "";
      }
    }
  }, [view, selectedTourId, selectedBookingId]);

  return {
    view, setView,
    selectedTourId, setSelectedTourId,
    selectedBookingId, setSelectedBookingId
  };
}
