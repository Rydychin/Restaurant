import { Bookmark, MapPin, Star } from "lucide-react";
import { useMemo, useRef, useState } from "react";
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
import FilterBar from "./FilterBar.jsx";
import SearchBar from "./SearchBar.jsx";

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

export default function MapView({ savedIds, onToggleSaved, onViewRestaurant }) {
  const [filters, setFilters] = useState(defaultRestaurantFilters);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeId, setActiveId] = useState(restaurants[0]?.id);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef(null);

  const matchedRestaurants = useMemo(() => {
    return filterRestaurants(restaurants, filters, searchTerm);
  }, [filters, searchTerm]);
  const activeRestaurant =
    matchedRestaurants.find((restaurant) => restaurant.id === activeId) ??
    matchedRestaurants[0];

  function updateFilter(name, value) {
    setFilters((current) => ({ ...current, [name]: value }));
  }

  function clearFilters() {
    setFilters(defaultRestaurantFilters);
    setSearchTerm("");
  }

  function startMapDrag(event) {
    if (event.target.closest("button")) {
      return;
    }

    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      originX: pan.x,
      originY: pan.y
    };
    setIsDragging(true);
  }

  function moveMap(event) {
    if (!dragRef.current || dragRef.current.pointerId !== event.pointerId) {
      return;
    }

    const nextX = dragRef.current.originX + event.clientX - dragRef.current.startX;
    const nextY = dragRef.current.originY + event.clientY - dragRef.current.startY;

    setPan({
      x: clamp(nextX, -180, 180),
      y: clamp(nextY, -140, 140)
    });
  }

  function stopMapDrag(event) {
    if (dragRef.current?.pointerId === event.pointerId) {
      dragRef.current = null;
      setIsDragging(false);
    }
  }

  function zoomMap(delta) {
    setZoom((current) => clamp(Number((current + delta).toFixed(2)), 0.75, 1.8));
  }

  function handleMapWheel(event) {
    event.preventDefault();
    const delta = event.deltaY > 0 ? -0.08 : 0.08;
    zoomMap(delta);
  }

  return (
    <section className="section-shell map-section">
      <div className="browse-header">
        <div>
          <p className="eyebrow">Mock map browsing</p>
          <h2>Map</h2>
        </div>
        <button type="button" onClick={clearFilters}>
          Reset
        </button>
      </div>

      <div className="map-layout">
        <aside className="map-panel" aria-label="Map search results">
          <SearchBar value={searchTerm} onChange={setSearchTerm} />
          <FilterBar
            filters={filters}
            options={{ areas, cuisines, priceRanges, ratingOptions, vibes }}
            onChange={updateFilter}
            resultCount={matchedRestaurants.length}
          />

          <div className="map-results-panel">
            <p className="map-results-heading">{matchedRestaurants.length} restaurants</p>
            <div className="map-result-list">
              {matchedRestaurants.map((restaurant) => {
                const isActive = activeRestaurant?.id === restaurant.id;

                return (
                  <button
                    key={restaurant.id}
                    type="button"
                    className={isActive ? "map-result active" : "map-result"}
                    onClick={() => {
                      setActiveId(restaurant.id);
                      onViewRestaurant(restaurant);
                    }}
                  >
                    <span className="map-result-main">
                      <strong>{restaurant.name}</strong>
                      <small>
                        {restaurant.cuisine} &middot; {restaurant.area}
                      </small>
                    </span>
                    <span className="map-result-meta">
                      <span>
                        <Star size={14} aria-hidden="true" />
                        {restaurant.rating.toFixed(1)}
                      </span>
                      <span>{restaurant.priceRange}</span>
                      <span>{restaurant.distance.toFixed(1)} mi</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </aside>

        <div
          className={isDragging ? "mock-map dragging" : "mock-map"}
          aria-label="Mock restaurant map"
          onPointerDown={startMapDrag}
          onPointerMove={moveMap}
          onPointerUp={stopMapDrag}
          onPointerCancel={stopMapDrag}
          onWheel={handleMapWheel}
        >
          <div
            className="map-world"
            style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})` }}
          >
            <div className="map-grid" aria-hidden="true" />
            <div className="map-road horizontal one" aria-hidden="true" />
            <div className="map-road horizontal two" aria-hidden="true" />
            <div className="map-road vertical one" aria-hidden="true" />
            <div className="map-road vertical two" aria-hidden="true" />

            {matchedRestaurants.map((restaurant) => {
              const isActive = activeRestaurant?.id === restaurant.id;

              return (
                <button
                  key={restaurant.id}
                  type="button"
                  className={isActive ? "map-pin active" : "map-pin"}
                  style={{
                    left: `${restaurant.mapPosition.x}%`,
                    top: `${restaurant.mapPosition.y}%`
                  }}
                  onClick={() => {
                    setActiveId(restaurant.id);
                    onViewRestaurant(restaurant);
                  }}
                  aria-label={`View ${restaurant.name}`}
                >
                  <MapPin size={20} aria-hidden="true" />
                  <span className="pin-preview" aria-hidden="true">
                    <strong>{restaurant.name}</strong>
                    <small>{restaurant.cuisine}</small>
                    <span>
                      {restaurant.rating.toFixed(1)} stars &middot;{" "}
                      {restaurant.priceRange} &middot;{" "}
                      {restaurant.distance.toFixed(1)} mi
                    </span>
                    <em>{restaurant.mustTryDish}</em>
                  </span>
                </button>
              );
            })}
          </div>

          <p className="map-drag-hint">Drag map to explore</p>
          <div className="map-zoom-controls" aria-label="Map zoom controls">
            <button type="button" onClick={() => zoomMap(0.15)} aria-label="Zoom in">
              +
            </button>
            <button type="button" onClick={() => zoomMap(-0.15)} aria-label="Zoom out">
              -
            </button>
          </div>

          {activeRestaurant && (
            <div className="map-popover">
              <div>
                <h3>{activeRestaurant.name}</h3>
                <p>
                  {activeRestaurant.cuisine} &middot; {activeRestaurant.area}
                </p>
                <span>
                  {activeRestaurant.rating.toFixed(1)} &middot;{" "}
                  {activeRestaurant.priceRange} &middot;{" "}
                  {activeRestaurant.distance.toFixed(1)} mi
                </span>
              </div>
              <button
                type="button"
                className={savedIds.has(activeRestaurant.id) ? "icon-save saved" : "icon-save"}
                onClick={() => onToggleSaved(activeRestaurant.id)}
                aria-label={savedIds.has(activeRestaurant.id) ? "Unsave" : "Save"}
                aria-pressed={savedIds.has(activeRestaurant.id)}
              >
                <Bookmark size={17} aria-hidden="true" />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
