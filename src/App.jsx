import { useState } from "react";
import Explore from "./components/Explore.jsx";
import FoodFeed from "./components/FoodFeed.jsx";
import MapView from "./components/MapView.jsx";
import NavigationTabs from "./components/NavigationTabs.jsx";
import Profile from "./components/Profile.jsx";
import RestaurantModal from "./components/RestaurantModal.jsx";
import TasteMatch from "./components/TasteMatch.jsx";
import { restaurants, userRatings } from "./data/restaurants.js";

function getInitialRatings() {
  return Object.fromEntries(
    userRatings.map((rating) => [rating.restaurantId, rating.rating])
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState("explore");
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [ratings, setRatings] = useState(getInitialRatings);
  const [savedIds, setSavedIds] = useState(
    () => new Set(restaurants.filter((restaurant) => restaurant.saved).map((item) => item.id))
  );

  function rateRestaurant(restaurantId, rating) {
    setRatings((current) => ({ ...current, [restaurantId]: rating }));
  }

  function toggleSaved(restaurantId) {
    setSavedIds((current) => {
      const next = new Set(current);
      if (next.has(restaurantId)) {
        next.delete(restaurantId);
      } else {
        next.add(restaurantId);
      }
      return next;
    });
  }

  function changeTab(tab) {
    setActiveTab(tab);
    window.scrollTo(0, 0);
  }

  return (
    <main className={`app-shell app-${activeTab}`}>
      <header className="app-header">
        <h1>
          <span className="brand-mark" aria-hidden="true">C</span>
          ClipDish
        </h1>
        <NavigationTabs activeTab={activeTab} onChange={changeTab} />
        <div className="header-spacer" aria-hidden="true" />
      </header>

      {activeTab === "explore" && (
        <Explore
          savedIds={savedIds}
          onToggleSaved={toggleSaved}
          onViewRestaurant={setSelectedRestaurant}
        />
      )}
      {activeTab === "map" && (
        <MapView
          savedIds={savedIds}
          onToggleSaved={toggleSaved}
          onViewRestaurant={setSelectedRestaurant}
        />
      )}
      {activeTab === "feed" && (
        <FoodFeed
          ratings={ratings}
          savedIds={savedIds}
          onRateRestaurant={rateRestaurant}
          onToggleSaved={toggleSaved}
          onViewRestaurant={setSelectedRestaurant}
        />
      )}
      {activeTab === "taste" && (
        <TasteMatch
          ratings={ratings}
          savedIds={savedIds}
          onRateRestaurant={rateRestaurant}
          onToggleSaved={toggleSaved}
          onViewDetails={setSelectedRestaurant}
        />
      )}
      {activeTab === "profile" && (
        <Profile
          ratings={ratings}
          savedIds={savedIds}
          onToggleSaved={toggleSaved}
          onViewDetails={setSelectedRestaurant}
        />
      )}

      <RestaurantModal
        restaurant={selectedRestaurant}
        isSaved={selectedRestaurant ? savedIds.has(selectedRestaurant.id) : false}
        userRating={selectedRestaurant ? ratings[selectedRestaurant.id] ?? 0 : 0}
        onRateRestaurant={rateRestaurant}
        onToggleSaved={toggleSaved}
        onClose={() => setSelectedRestaurant(null)}
      />
    </main>
  );
}
