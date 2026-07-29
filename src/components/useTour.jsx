import { useState, useEffect, useMemo } from "react";
import * as Icons from "lucide-react";
import { formatPrice } from "../data/translations";
import { socialPosts } from "../data/socialPosts";
import { useTranslation } from "../i18n/LanguageContext";

export function useTour({ tour, allTours, setSelectedTourId, activeCurrency, wishlist, onAddToWishlist, onRemoveFromWishlist }) {
  const [activeTab, setActiveTab] = useState("detail"); // "detail" | "itinerary" | "map" | "photos"
  const [heroSlideIndex, setHeroSlideIndex] = useState(0);

  const numericId = typeof tour.id === "number" ? tour.id : (typeof tour.id === "string" ? parseInt(tour.id.replace(/\D/g, "")) || 0 : 0);
  const initialBell = 56 + (numericId % 5) * 10;
  const initialLeaf = 90 + (numericId % 3) * 15;
  const initialMsg = (numericId % 4) + 1;
  const initialCam = (numericId % 6) + 2;

  const [ratingVal, setRatingVal] = useState(tour.rating || 4.7);
  const [bellVal, setBellVal] = useState(initialBell);
  const [leafVal, setLeafVal] = useState(initialLeaf);
  const [msgVal, setMsgVal] = useState(initialMsg);
  const [camVal, setCamVal] = useState(initialCam);

  // Review form modal state
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewName, setReviewName] = useState("");
  const [reviewComment, setReviewComment] = useState("");
  const [reviewStars, setReviewStars] = useState(5);
  const [reviewBell, setReviewBell] = useState(initialBell);
  const [reviewLeaf, setReviewLeaf] = useState(initialLeaf);
  const [reviewMsg, setReviewMsg] = useState(initialMsg);
  const [reviewCam, setReviewCam] = useState(initialCam);

  // Local social proof posts so submitted reviews show up instantly
  const [localPosts, setLocalPosts] = useState(socialPosts);

  // Build the slider images array from tour data
  const heroImages = useMemo(() => {
    let rawImgs = tour.heroImages;
    if (typeof rawImgs === "string") {
      try {
        rawImgs = JSON.parse(rawImgs);
      } catch (e) {
        rawImgs = rawImgs.split(",").map((s) => s.trim()).filter(Boolean);
      }
    }
    const imgs = Array.isArray(rawImgs) && rawImgs.length > 0 ? rawImgs : [tour.image];
    return imgs.filter(Boolean).map((img) => {
      const lower = img.toLowerCase();
      if (lower.includes("torres-del-paine")) return "/slider-torres-del-paine.webp";
      if (lower.includes("machu-picchu") || lower.includes("machu-pichu")) return "/slider-machu-pichu.webp";
      if (lower.includes("salar-de-uyuni")) return "/slider-salar-de-uyuni.webp";
      if (lower.includes("rio-de-janeiro")) return "/slider-rio-de-janeiro.webp";
      if (lower.includes("cataratas-del-iguazu")) return "/slider-cataratas-del-iguazu.webp";
      if (lower.includes("ciudad-perdida")) return "/slider-ciudad-perdida.webp";
      if (lower.includes("isla-galapagos") || lower.includes("galapagos")) return "/slider-isla-galapagos.webp";
      if (lower.includes("perito-moreno")) return "/slider-perito-moreno.webp";
      if (lower.includes("punta-cana")) return "/slider-punta-cana.webp";
      if (lower.includes("valle-de-la-luna")) return "/slider-valle-de-la-luna.webp";
      return img;
    });
  }, [tour.heroImages, tour.image]);

  // Auto-advance slider
  useEffect(() => {
    if (heroImages.length <= 1) return;
    const timer = setInterval(() => {
      setHeroSlideIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroImages.length]);

  const goHeroSlide = (idx) => {
    setHeroSlideIndex(((idx % heroImages.length) + heroImages.length) % heroImages.length);
  };

  const [expandedDay, setExpandedDay] = useState(0); // Accordion state for itinerary
  const [date, setDate] = useState("");
  const [guests, setGuests] = useState(1);
  const [selectedFlexDate, setSelectedFlexDate] = useState(null); // 0 = Standard, 1 = -10%, 2 = -5%
  const [calendarViewDate, setCalendarViewDate] = useState(new Date(2026, 6, 1)); // Starts in July 2026

  // B2C States for Weather Guarantee, Group Planner, and Carbon Footprint
  const [windSpeedOverride, setWindSpeedOverride] = useState(null);
  const [checkedItems, setCheckedItems] = useState({});

  // Innovation States: Reels & Travel Buddy Matching
  const [showReelPlayer, setShowReelPlayer] = useState(false);
  const [reelLikes, setReelLikes] = useState(389);
  const [hasLikedReel, setHasLikedReel] = useState(false);

  const [selectedBuddyChat, setSelectedBuddyChat] = useState(null);
  const [chatInput, setChatInput] = useState("");
  const [buddyChats, setBuddyChats] = useState([
    { sender: "Lucas M.", text: "¡Hola! Estoy buscando unirme a este tour a mediados de Julio. ¿Te gustaría coordinar?", time: "14:10" }
  ]);

  // Social Proof Grid (Muro de Aventureros) Logic
  const matchingPosts = localPosts.filter((p) => p.tourId === tour.id || String(p.tourId) === String(tour.id));
  const tourSeed = String(tour.id || tour.title || tour.location)
    .split("")
    .reduce((sum, char) => sum + char.charCodeAt(0), 0);

  const fallbackPost = {
    tourId: tour.id,
    username: `@aventurero.${(tour.location || "").split(",")[0].toLowerCase().replace(/[^a-z0-9]/g, "")}`,
    location: tour.location,
    comment: `¡Una experiencia absolutamente increíble en ${tour.title}! La organización de Busca Tours estuvo impecable de principio a fin. Altamente recomendado. ✈️✨`,
    image: tour.image || "https://images.unsplash.com/photo-1528164344705-47542687000d?auto=format&fit=crop&w=800&q=80",
    rating: 5,
    likes: (tourSeed % 250) + 120,
    comments: (tourSeed % 20) + 8,
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
  };

  const activePosts = matchingPosts.length > 0
    ? [...matchingPosts, ...localPosts.filter((p) => p.tourId !== tour.id && String(p.tourId) !== String(tour.id))]
    : [fallbackPost, ...localPosts];

  const displayedPosts = activePosts.slice(0, 4);

  const handlePostClick = (postTourId) => {
    if (postTourId && String(postTourId) !== String(tour.id)) {
      setSelectedTourId(postTourId);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const simulatedWindSpeed = useMemo(() => {
    if (date) {
      let modifier = 0;
      for (let i = 0; i < date.length; i++) {
        modifier += date.charCodeAt(i);
      }
      const deltaWind = (modifier % 41) - 20; // -20 to +20
      return Math.max(10, Math.min(100, 28 + deltaWind));
    }
    return 28;
  }, [date]);
  const windSpeed = windSpeedOverride ?? simulatedWindSpeed;

  const [showGroupPlanner, setShowGroupPlanner] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [plannerVotes, setPlannerVotes] = useState([
    { name: "Sofía (Amigo)", date: "12/07/2026", status: "Confirmado 👍" },
    { name: "Carlos (Amigo)", date: "Pendiente", status: "Sugerido 💬" }
  ]);
  const [plannerChatMsg, setPlannerChatMsg] = useState("");
  const [plannerChats, setPlannerChats] = useState([
    { sender: "Sofía", text: "¡El trekking Torres del Paine se ve alucinante!", time: "15:30" },
    { sender: "Carlos", text: "¿Qué día nos acomoda más?", time: "15:31" }
  ]);

  // Wishlist
  const isFavorited = wishlist && wishlist.includes(tour.id);
  const toggleWishlist = () => {
    if (isFavorited) {
      onRemoveFromWishlist(tour.id);
    } else {
      onAddToWishlist(tour.id);
    }
  };

  // Itinerary
  const getItineraryDays = () => {
    if (Array.isArray(tour.itinerary) && tour.itinerary.length > 0) {
      return tour.itinerary.map((d) => ({ title: d.title || '', content: d.content || '' }));
    }
    const isOneDay = tour.oneDay;
    if (isOneDay) {
      return [
        {
          title: "Día 1: Salida de Puerto Natales y Exploración Principal",
          content: "Iniciamos temprano por la mañana saliendo de nuestro punto de encuentro. Nos dirigimos en transporte premium hacia el destino principal disfrutando de las vistas panorámicas. Realizaremos las caminatas principales y paradas de fotografías guiadas por nuestro experto local."
        },
        {
          title: "Día 1 (Tarde): Almuerzo Patagónico y Retorno",
          content: "Disfrutaremos de un Box Lunch premium en un punto panorámico o un almuerzo tradicional en estancia local (según el tour). Por la tarde realizaremos las últimas exploraciones arqueológicas o de glaciares antes de emprender el viaje de regreso al punto de partida."
        }
      ];
    }
    return [
      {
        title: "Día 1: Llegada y Acomodación en el Destino",
        content: "Recepción en el aeropuerto/terminal por parte de nuestro equipo. Traslado al hotel seleccionado de categoría premium. Reunión técnica de orientación con el guía de montaña y cena de bienvenida con comida tradicional de la región."
      },
      {
        title: "Día 2: Exploración de Puntos Históricos y Senderos Iniciales",
        content: "Desayuno completo en el hotel. Iniciamos el recorrido de aclimatación visitando los miradores principales y parajes naturales emblemáticos del tour. Caminatas cortas de dificultad moderada y sesión fotográfica al atardecer."
      },
      {
        title: "Día 3: Gran Aventura y Desafío del Recorrido",
        content: "El día fuerte del itinerario. Desayuno a primera hora y salida al trekking o exploración de jornada completa. Caminata guiada por senderos boscosos, cruce de ríos controlados o navegación cercana a glaciares. Almuerzo tipo picnic en mirador panorámico."
      },
      {
        title: "Día 4: Día de Relajación y Cultura Local",
        content: "Día para recuperar energías. Visita a una estancia histórica local para conocer el proceso de esquila y la cultura ovina de la Patagonia. Almuerzo tradicional de cordero al palo y tarde libre para recorrer los pueblos locales o tomar actividades opcionales."
      },
      {
        title: "Día 5: Retorno y Despedida del Destino",
        content: "Desayuno de despedida en el hotel. Tiempo libre para compras de souvenirs de última hora. Traslado privado hacia el aeropuerto/terminal para emprender el viaje de regreso a casa."
      }
    ];
  };

  const itineraryDays = getItineraryDays();
  const relatedTours = allTours.filter((t) => t.id !== tour.id && t.category === tour.category).slice(0, 2);
  const toggleDay = (idx) => setExpandedDay(expandedDay === idx ? -1 : idx);

  // Weather
  const getSimulatedWeather = (location) => {
    const loc = location.toLowerCase();
    if (loc.includes("patagonia") || loc.includes("natales") || loc.includes("fuego") || loc.includes("paine") || loc.includes("bernardo")) {
      return { temp: "6°C", status: "Windy", icon: "Wind", desc: "Frío y Viento Fuerte", tip: "Lleva cortavientos, gorro y guantes térmicos.", color: "#38bdf8" };
    }
    if (loc.includes("suiza") || loc.includes("zermatt") || loc.includes("finlandia") || loc.includes("rovaniemi")) {
      return { temp: "-3°C", status: "Snowy", icon: "Snowflake", desc: "Nieve Moderada", tip: "Ropa de nieve impermeable de 3 capas obligatoria.", color: "#93c5fd" };
    }
    if (loc.includes("dubái") || loc.includes("emiratos")) {
      return { temp: "39°C", status: "Sunny", icon: "Sun", desc: "Calor Extremo", tip: "Trae abundante agua, protector solar y gorro.", color: "#fbbf24" };
    }
    if (loc.includes("tailandia") || loc.includes("phuket")) {
      return { temp: "29°C", status: "Rainy", icon: "CloudRain", desc: "Tormenta Tropical", tip: "Lleva impermeable ligero y calzado antideslizante.", color: "#60a5fa" };
    }
    return { temp: "20°C", status: "Cloudy", icon: "CloudSun", desc: "Nublado con Sol", tip: "Ropa ligera con un suéter para la tarde.", color: "#fbbf24" };
  };

  const getDynamicWeather = (location, selectedDate) => {
    const base = getSimulatedWeather(location);
    if (!selectedDate) return base;
    let modifier = 0;
    for (let i = 0; i < selectedDate.length; i++) {
      modifier += selectedDate.charCodeAt(i);
    }
    const tempNum = parseInt(base.temp, 10);
    const deltaTemp = (modifier % 9) - 4;
    const finalTemp = tempNum + deltaTemp;
    return { ...base, temp: `${finalTemp}°C` };
  };

  const weather = getDynamicWeather(tour.location, date);
  const WeatherIcon = Icons[weather.icon] || Icons.CloudSun;

  // Buddy chat
  const handleSendBuddyMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const newMsg = { sender: "Tú", text: chatInput, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) };
    setBuddyChats((prev) => [...prev, newMsg]);
    setChatInput("");
    setTimeout(() => {
      const responses = [
        "¡Excelente! Me parece genial. Yo ya tengo libre esa semana de Julio.",
        "¡Buenísimo! ¿Cuántos pasajeros van contigo? Yo viajo solo.",
        "Súper. Este tour se ve alucinante, me anoto seguro.",
        "¡Sí! Ojalá el clima nos acompañe. Ya vi el Weather Match y pinta muy bien."
      ];
      const randomReply = responses[Math.floor(Math.random() * responses.length)];
      setBuddyChats((prev) => [...prev, { sender: selectedBuddyChat || "Lucas M.", text: randomReply, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }]);
    }, 1500);
  };

  // Review submit
  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!reviewName.trim() || !reviewComment.trim()) {
      alert("Por favor, completa todos los campos.");
      return;
    }
    const newPost = {
      tourId: tour.id,
      username: `@${reviewName.trim().toLowerCase().replace(/[^a-z0-9]/g, "")}`,
      location: tour.location,
      comment: reviewComment.trim(),
      image: tour.image || "https://images.unsplash.com/photo-1528164344705-47542687000d?auto=format&fit=crop&w=800&q=80",
      rating: reviewStars,
      likes: 12,
      comments: 0,
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150"
    };
    setLocalPosts((prev) => [newPost, ...prev]);
    setRatingVal((prev) => (prev * 9 + reviewStars) / 10);
    setBellVal(reviewBell);
    setLeafVal(reviewLeaf);
    setMsgVal((prev) => Math.round((prev * 9 + reviewMsg) / 10));
    setCamVal(reviewCam);
    setReviewComment("");
    setReviewName("");
    setShowReviewModal(false);
    alert("¡Muchas gracias por tu valoración!");
  };

  // Availability calendar
  const renderAvailabilityCalendar = () => {
    const year = calendarViewDate.getFullYear();
    const month = calendarViewDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const startOffset = new Date(year, month, 1).getDay();
    const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    const monthName = monthNames[month];
    const weekDays = ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sá"];
    const cells = [];
    for (let i = 0; i < startOffset; i++) {
      cells.push(<div key={`empty-${year}-${month}-${i}`} style={{ aspectRatio: 1.1 }} />);
    }
    const rawAvailability = typeof tour.availableDates === 'string' ? JSON.parse(tour.availableDates) : (tour.availableDates || {});
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      const isSelected = date === dateStr;
      const entry = rawAvailability[dateStr];
      const status = entry?.status || "available";
      const priceMod = entry?.priceMod || 0;
      const dayPrice = tour.price + priceMod;
      cells.push(
        <div
          key={`${year}-${month}-${d}`}
          className={`calendar-cell ${status} ${isSelected ? "selected" : ""}`}
          onClick={() => {
            if (status !== "booked-out") {
              setDate(dateStr);
              setWindSpeedOverride(null);
              setSelectedFlexDate(0);
            }
          }}
          style={{ cursor: status === "booked-out" ? "not-allowed" : "pointer" }}
        >
          <span style={{ fontSize: "0.75rem", fontWeight: 700 }}>{d}</span>
          {status !== "booked-out" ? (
            <span className="calendar-price-tag" style={{ color: "rgb(215, 156, 11)" }}>
              {formatPrice(dayPrice, activeCurrency)}
            </span>
          ) : (
            <span style={{ fontSize: "0.55rem", opacity: 0.5 }}>Agotado</span>
          )}
        </div>
      );
    }
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "8px", border: "1px solid var(--border-color)", padding: "12px", borderRadius: "8px", backgroundColor: "rgba(0,0,0,0.01)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
          <button
            onClick={() => setCalendarViewDate(new Date(year, month - 1, 1))}
            style={{ background: "none", border: "none", cursor: "pointer", fontSize: "1.2rem", color: "var(--text-muted)" }}
          >
            ‹
          </button>
          <span style={{ fontWeight: 700, fontSize: "0.9rem" }}>{monthName} {year}</span>
          <button
            onClick={() => setCalendarViewDate(new Date(year, month + 1, 1))}
            style={{ background: "none", border: "none", cursor: "pointer", fontSize: "1.2rem", color: "var(--text-muted)" }}
          >
            ›
          </button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "4px" }}>
          {weekDays.map((wd) => (
            <div key={wd} style={{ textAlign: "center", fontSize: "0.65rem", fontWeight: 700, color: "var(--text-muted)" }}>{wd}</div>
          ))}
          {cells}
        </div>
      </div>
    );
  };

  const { t: tText } = useTranslation();

  return {
    tText,
    // tabs & hero
    activeTab, setActiveTab,
    heroSlideIndex, setHeroSlideIndex, goHeroSlide, heroImages,
    // vibe scores
    ratingVal, bellVal, leafVal, msgVal, camVal,
    // review modal
    showReviewModal, setShowReviewModal,
    reviewName, setReviewName, reviewComment, setReviewComment,
    reviewStars, setReviewStars, reviewBell, setReviewBell, reviewLeaf, setReviewLeaf, reviewMsg, setReviewMsg, reviewCam, setReviewCam,
    localPosts, setLocalPosts, handleReviewSubmit,
    handlePostClick,
    // itinerary
    expandedDay, toggleDay, itineraryDays, relatedTours,
    // booking widget
    date, setDate, guests, setGuests, selectedFlexDate, setSelectedFlexDate,
    calendarViewDate, setCalendarViewDate, renderAvailabilityCalendar,
    // weather
    weather, WeatherIcon, windSpeed, windSpeedOverride, setWindSpeedOverride,
    // checklist
    checkedItems, setCheckedItems,
    // reels
    showReelPlayer, setShowReelPlayer, reelLikes, setReelLikes, hasLikedReel, setHasLikedReel,
    // buddy
    selectedBuddyChat, setSelectedBuddyChat, chatInput, setChatInput, buddyChats, setBuddyChats, handleSendBuddyMessage,
    // group planner
    showGroupPlanner, setShowGroupPlanner, copiedLink, setCopiedLink,
    plannerVotes, setPlannerVotes, plannerChatMsg, setPlannerChatMsg, plannerChats, setPlannerChats,
    // wishlist
    isFavorited, toggleWishlist,
    // display posts
    displayedPosts
  };
}
