import { useMemo, useState } from "react";
import FilterBar from "./FilterBar.jsx";
import RestaurantCard from "./RestaurantCard.jsx";
import SearchBar from "./SearchBar.jsx";
import {
  areas,
  cuisines,
  priceRanges,
  ratingOptions,
  restaurants,
  vibes
} from "../data/restaurants.js";
import {
  defaultRestaurantFilters,
  filterRestaurants
} from "../utils/filterRestaurants.js";

export default function Explore({
  savedIds,
  onToggleSaved,
  onViewRestaurant
}) {
  const [filters, setFilters] = useState(defaultRestaurantFilters);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredRestaurants = useMemo(() => {
    return filterRestaurants(restaurants, filters, searchTerm);
  }, [filters, searchTerm]);

  function updateFilter(name, value) {
    setFilters((current) => ({ ...current, [name]: value }));
  }

  function clearFilters() {
    setFilters(defaultRestaurantFilters);
    setSearchTerm("");
  }

  return (
    <>
      <section className="section-shell explore-section">
        <div className="browse-header">
          <div>
            <h2>Explore Restaurants</h2>
            <p>Find restaurants through video reviews, ratings, and taste-based recommendations.</p>
          </div>
          <button type="button" onClick={clearFilters}>
            Reset
          </button>
        </div>

        <div className="explore-filter-panel">
          <SearchBar value={searchTerm} onChange={setSearchTerm} />

          <FilterBar
            filters={filters}
            options={{ areas, cuisines, priceRanges, ratingOptions, vibes }}
            onChange={updateFilter}
            resultCount={filteredRestaurants.length}
          />
        </div>

        {filteredRestaurants.length > 0 ? (
          <div className="restaurant-grid">
            {filteredRestaurants.map((restaurant) => (
              <RestaurantCard
                key={restaurant.id}
                restaurant={restaurant}
                isSaved={savedIds.has(restaurant.id)}
                onToggleSaved={onToggleSaved}
                onViewDetails={onViewRestaurant}
                showDistance
                compact
              />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <h2>No restaurants found.</h2>
            <p>Try adjusting your search or filters.</p>
          </div>
        )}
      </section>

    </>
  );
}
