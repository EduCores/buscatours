import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";
import TourDetailView from "../components/TourDetailView";

vi.mock("../components/tour/TourHeroGallery", () => ({
  default: () => <div data-testid="hero-gallery">Tour Test Machu Picchu</div>,
}));

vi.mock("../components/tour/TourSidebarWidgets", () => ({
  default: () => <div data-testid="sidebar-widgets">Sidebar</div>,
}));

vi.mock("../components/tour/ReviewModal", () => ({
  default: () => <div data-testid="review-modal">Review Modal</div>,
}));

vi.mock("../components/tour/GroupPlannerModal", () => ({
  default: () => <div data-testid="group-planner-modal">Group Planner</div>,
}));

vi.mock("../components/tour/ReelPlayerModal", () => ({
  default: () => <div data-testid="reel-player-modal">Reel Player</div>,
}));

vi.mock("../components/tour/BuddyChatModal", () => ({
  default: () => <div data-testid="buddy-chat-modal">Buddy Chat</div>,
}));

vi.mock("../i18n/LanguageContext", () => ({
  useTranslation: () => ({
    t: (key) => key,
    activeLanguage: "ES",
    setLanguage: vi.fn(),
  }),
}));

vi.mock("../components/useTour", () => ({
  useTour: () => ({
    activeTab: "details",
    setActiveTab: vi.fn(),
    heroSlideIndex: 0,
    goHeroSlide: vi.fn(),
    heroImages: [],
    ratingVal: 5,
    bellVal: 0,
    leafVal: 0,
    msgVal: 0,
    camVal: 0,
    showReviewModal: false,
    setShowReviewModal: vi.fn(),
    reviewName: "",
    setReviewName: vi.fn(),
    reviewComment: "",
    setReviewComment: vi.fn(),
    reviewStars: 0,
    setReviewStars: vi.fn(),
    reviewBell: 0,
    setReviewBell: vi.fn(),
    reviewLeaf: 0,
    setReviewLeaf: vi.fn(),
    reviewMsg: 0,
    setReviewMsg: vi.fn(),
    reviewCam: 0,
    setReviewCam: vi.fn(),
    localPosts: [],
    handleReviewSubmit: vi.fn(),
    handlePostClick: vi.fn(),
    expandedDay: null,
    toggleDay: vi.fn(),
    itineraryDays: [],
    relatedTours: [],
    date: new Date().toISOString().split("T")[0],
    setDate: vi.fn(),
    guests: 1,
    setGuests: vi.fn(),
    selectedFlexDate: 0,
    setSelectedFlexDate: vi.fn(),
    calendarViewDate: new Date(),
    setCalendarViewDate: vi.fn(),
    renderAvailabilityCalendar: vi.fn(() => <div data-testid="calendar" />),
    weather: { temp: "22°C", desc: "Sunny", tip: "Perfect weather", color: "#fbbf24" },
    WeatherIcon: ({ size }) => <span data-testid="weather-icon" />,
    windSpeed: 0,
    windSpeedOverride: 0,
    setWindSpeedOverride: vi.fn(),
    checkedItems: {},
    setCheckedItems: vi.fn(),
    showReelPlayer: false,
    setShowReelPlayer: vi.fn(),
    reelLikes: 0,
    setReelLikes: vi.fn(),
    hasLikedReel: false,
    setHasLikedReel: vi.fn(),
    selectedBuddyChat: null,
    setSelectedBuddyChat: vi.fn(),
    chatInput: "",
    setChatInput: vi.fn(),
    buddyChats: [],
    setBuddyChats: vi.fn(),
    handleSendBuddyMessage: vi.fn(),
    showGroupPlanner: false,
    setShowGroupPlanner: vi.fn(),
    copiedLink: false,
    setCopiedLink: vi.fn(),
    plannerVotes: [],
    setPlannerVotes: vi.fn(),
    plannerChatMsg: "",
    setPlannerChatMsg: vi.fn(),
    plannerChats: [],
    setPlannerChats: vi.fn(),
    isFavorited: false,
    toggleWishlist: vi.fn(),
    displayedPosts: [],
    tText: (key) => key,
  }),
}));

vi.mock("../data/translations", () => ({
  formatPrice: (price) => "$" + price,
}));

const mockTour = {
  id: "test-tour-1",
  title: "Tour Test Machu Picchu",
  description: "Descripción de prueba del tour",
  price: 1500,
  currency: "USD",
  category: "Aventura",
  destination: "Perú",
  region: "Latino América",
  duration: "5 días",
  minAge: 12,
  maxPassengers: 15,
  images: ["https://example.com/image1.jpg", "https://example.com/image2.jpg"],
  discount: "10% Off",
  highlights: ["Highlight 1", "Highlight 2"],
  includes: ["Include 1", "Include 2"],
  excludes: ["Exclude 1"],
  itinerary: [
    { day: 1, title: "Llegada", description: "Día de llegada", activities: ["Actividad 1"] },
    { day: 2, title: "Tour", description: "Tour principal", activities: ["Actividad 2"] },
  ],
  reviewsCount: 25,
  rating: 4.8,
};

const mockAllTours = [
  mockTour,
  { ...mockTour, id: "test-tour-2", title: "Tour Test Cusco", destination: "Perú" },
];

describe("TourDetailView", () => {
  const defaultProps = {
    tour: mockTour,
    allTours: mockAllTours,
    setSelectedTourId: vi.fn(),
    activeCurrency: "USD",
    activeLanguage: "ES",
    onBookTour: vi.fn(),
    wishlist: [],
    onAddToWishlist: vi.fn(),
    onRemoveFromWishlist: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders without crashing", () => {
    render(<TourDetailView {...defaultProps} />);
    expect(screen.getByTestId("hero-gallery")).toBeInTheDocument();
  });
});