import { useState, useMemo } from "react";
import { dataService } from "../services/dataService";

const diversifyTours = (tours) => {
  const remaining = tours.map((tour, index) => ({ tour, index }));
  const result = [];
  const destinationCounts = {};
  const categoryCounts = {};
  let lastDestination = "";
  let lastCategory = "";

  while (remaining.length > 0) {
    let bestCandidateIndex = 0;
    let bestScore = Number.POSITIVE_INFINITY;

    remaining.forEach((candidate, candidateIndex) => {
      const destination = candidate.tour.destination || candidate.tour.location || "";
      const category = candidate.tour.category || "";
      const score =
        (destinationCounts[destination] || 0) * 3 +
        (categoryCounts[category] || 0) * 2 +
        (destination === lastDestination ? 5 : 0) +
        (category === lastCategory ? 3 : 0) +
        candidate.index / 1000;

      if (score < bestScore) {
        bestScore = score;
        bestCandidateIndex = candidateIndex;
      }
    });

    const [selected] = remaining.splice(bestCandidateIndex, 1);
    const destination = selected.tour.destination || selected.tour.location || "";
    const category = selected.tour.category || "";

    result.push(selected.tour);
    destinationCounts[destination] = (destinationCounts[destination] || 0) + 1;
    categoryCounts[category] = (categoryCounts[category] || 0) + 1;
    lastDestination = destination;
    lastCategory = category;
  }

  return result;
};

export const takeDiverseTours = (tours, limit, excludedIds = new Set()) => {
  const unique = [];
  const seenIds = new Set(excludedIds);

  tours.forEach((tour) => {
    if (!seenIds.has(tour.id)) {
      unique.push(tour);
      seenIds.add(tour.id);
    }
  });

  return diversifyTours(unique).slice(0, limit);
};

export function useToursFilter({ toursList, setToursList, setBookingsList, currentUser, setCurrentUser, availableUsers, setAvailableUsers, view, setView, selectedTourId, setSelectedTourId }) {
  const [filters, setFilters] = useState({
    query: "",
    duration: "all",
    category: "all",
    maxPrice: 4000,
    searchMode: "ai",
    vibeScores: { adrenaline: 50, relax: 50, culture: 50, family: 50 }
  });

  const [activeDestinationView, setActiveDestinationView] = useState(null);
  const [activeActivity, setActiveActivity] = useState("all");
  const [compareTours, setCompareTours] = useState([]);
  const [showCompareModal, setShowCompareModal] = useState(false);

  const handleFilterChange = (newFilters) => setFilters(newFilters);

  const handleSelectActivity = (activity) => {
    setActiveActivity(activity);
    setFilters((prev) => ({ ...prev, category: activity }));
  };

  const handleTourClick = (tourId) => {
    setSelectedTourId(tourId);
    setView("detail");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // CRUD: Save / Delete tour
  const handleSaveTour = async (tourToSave) => {
    try {
      const savedTour = await dataService.saveTour(tourToSave);
      setToursList((prev) => {
        const index = prev.findIndex((t) => t.id === savedTour.id);
        if (index >= 0) return prev.map((t) => (t.id === savedTour.id ? savedTour : t));
        return [...prev, savedTour];
      });
      return savedTour;
    } catch (e) {
      console.error("Error saving tour:", e);
      throw e;
    }
  };

  const handleDeleteTour = async (tourId) => {
    try {
      await dataService.deleteTour(tourId);
      setToursList((prev) => prev.filter((t) => t.id !== tourId));
      if (selectedTourId === tourId) setView("home");
    } catch (e) {
      console.error("Error deleting tour:", e);
    }
  };

  // Booking success handler
  const handleBookingSuccess = async (booking) => {
    try {
      const savedBooking = await dataService.addBooking({ ...booking, userId: booking.userId || currentUser?.id });
      setBookingsList((prev) => [...prev, savedBooking]);
    } catch (e) {
      console.error("Error adding booking:", e);
    }
  };

  const handleUserChange = async (userId) => {
    const user = availableUsers.find((u) => u.id === userId);
    if (user) {
      setCurrentUser(user);
      if (user.role === "customer" && view === "admin") setView("home");
    }
  };

  const handleRegisterUser = async (newUser) => {
    try {
      const updatedUsers = await dataService.addUser(newUser);
      setAvailableUsers(updatedUsers);
      setCurrentUser(newUser);
      setView("home");
    } catch (e) {
      console.error("Error registrando usuario, guardando en local:", e);
      setAvailableUsers((prev) => {
        const exists = prev.some((u) => u.id === newUser.id);
        return exists ? prev : [...prev, newUser];
      });
      setCurrentUser(newUser);
      setView("home");
    }
  };

  const handleToggleCompare = (tourId) => {
    setCompareTours((prev) => {
      if (prev.includes(tourId)) return prev.filter((id) => id !== tourId);
      if (prev.length >= 3) {
        alert("Puedes comparar un máximo de 3 tours a la vez.");
        return prev;
      }
      return [...prev, tourId];
    });
  };

  const selectedTour = useMemo(() => toursList.find((t) => t.id === selectedTourId), [selectedTourId, toursList]);

  const categoriesList = useMemo(() => [...new Set(toursList.map((t) => t.category))], [toursList]);

  const filteredTours = useMemo(() => {
    const isVibeMode = filters.searchMode === "vibe";

    const filtered = toursList.filter((tour) => {
      const userRole = currentUser?.role;
      const isPendingOrDraft = tour.status === "PENDING" || tour.status === "DRAFT";
      if (isPendingOrDraft) {
        if (userRole === "platform-admin" || userRole === "tour-admin") {
          // Admins see all
        } else if (userRole === "operator" && tour.operatorId === currentUser?.id) {
          // Operators see their own pending/draft tours
        } else {
          return false;
        }
      }

      if (!isVibeMode && filters.query) {
        const queryLower = filters.query.toLowerCase();
        const inTitle = tour.title.toLowerCase().includes(queryLower);
        const inLocation = tour.location.toLowerCase().includes(queryLower);
        const inDestination = tour.destination && tour.destination.toLowerCase().includes(queryLower);
        const inDescription = tour.description && tour.description.toLowerCase().includes(queryLower);
        if (!inTitle && !inLocation && !inDestination && !inDescription) return false;
      }

      if (!isVibeMode && filters.duration !== "all") {
        const hours = tour.durationHours;
        if (filters.duration === "1" && hours > 12) return false;
        if (filters.duration === "short" && (hours <= 12 || hours > 144)) return false;
        if (filters.duration === "long" && hours <= 144) return false;
      }

      const selectedCategory = filters.category;
      if (!isVibeMode && selectedCategory !== "all" && tour.category !== selectedCategory) return false;

      if (tour.price > filters.maxPrice) return false;

      return true;
    });

    if (isVibeMode && filters.vibeScores) {
      const { adrenaline, relax, culture, family } = filters.vibeScores;
      const scored = filtered.map((tour) => {
        const tAd = tour.vibeAdrenaline !== undefined ? tour.vibeAdrenaline : 50;
        const tRl = tour.vibeRelax !== undefined ? tour.vibeRelax : 50;
        const tCl = tour.vibeCulture !== undefined ? tour.vibeCulture : 50;
        const tFm = tour.vibeFamily !== undefined ? tour.vibeFamily : 50;
        const avgDiff = (Math.abs(tAd - adrenaline) + Math.abs(tRl - relax) + Math.abs(tCl - culture) + Math.abs(tFm - family)) / 4;
        return { ...tour, vibeMatchPercentage: Math.round(100 - avgDiff) };
      });
      return scored.sort((a, b) => b.vibeMatchPercentage - a.vibeMatchPercentage);
    }

    return filtered;
  }, [filters, toursList, currentUser]);

  const flashDealTours = useMemo(() => {
    const candidates = filteredTours.filter((t) => t.discount || t.popular);
    return takeDiverseTours(candidates.length > 0 ? candidates : filteredTours, 4);
  }, [filteredTours]);

  const flashDealIds = useMemo(() => new Set(flashDealTours.map((t) => t.id)), [flashDealTours]);

  const popularDeals = useMemo(() => takeDiverseTours(filteredTours.filter((t) => t.popular), 4, flashDealIds), [filteredTours, flashDealIds]);

  const popularDealIds = useMemo(() => new Set(popularDeals.map((t) => t.id)), [popularDeals]);

  const vacationTours = useMemo(() => {
    const excludedIds = new Set([...flashDealIds, ...popularDealIds]);
    return takeDiverseTours(filteredTours.filter((t) => !t.oneDay), 6, excludedIds);
  }, [filteredTours, flashDealIds, popularDealIds]);

  const vacationTourIds = useMemo(() => new Set(vacationTours.map((t) => t.id)), [vacationTours]);

  const oneDayTours = useMemo(() => {
    const excludedIds = new Set([...flashDealIds, ...popularDealIds, ...vacationTourIds]);
    return takeDiverseTours(filteredTours.filter((t) => t.oneDay), 6, excludedIds);
  }, [filteredTours, flashDealIds, popularDealIds, vacationTourIds]);

  return {
    filters, setFilters, handleFilterChange,
    activeDestinationView, setActiveDestinationView,
    activeActivity, setActiveActivity, handleSelectActivity,
    compareTours, setCompareTours, showCompareModal, setShowCompareModal, handleToggleCompare,
    handleTourClick, handleSaveTour, handleDeleteTour,
    handleBookingSuccess, handleUserChange, handleRegisterUser,
    selectedTour, categoriesList, filteredTours,
    flashDealTours, popularDeals, vacationTours, oneDayTours
  };
}
