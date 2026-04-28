import { Bookmark, Info, MapPin, Star } from "lucide-react";
import { useEffect, useMemo, useRef } from "react";
import { restaurants } from "../data/restaurants.js";
import StarRating from "./StarRating.jsx";
import TikTokEmbed from "./TikTokEmbed.jsx";

function getStableRandomScore(id) {
  return [...id].reduce((total, character) => total + character.charCodeAt(0), 0) % 17;
}

function getTasteTagsFromRatings(ratings) {
  const likedIds = new Set(
    Object.entries(ratings)
      .filter(([, rating]) => rating >= 4)
      .map(([restaurantId]) => restaurantId)
  );

  return new Set(
    restaurants
      .filter((restaurant) => likedIds.has(restaurant.id))
      .flatMap((restaurant) => restaurant.tasteTags)
  );
}

export default function FoodFeed({
  ratings,
  savedIds,
  onRateRestaurant,
  onToggleSaved,
  onViewRestaurant
}) {
  const feedRef = useRef(null);
  const feedRestaurants = useMemo(() => {
    const likedTags = getTasteTagsFromRatings(ratings);

    return [...restaurants]
      .map((restaurant) => {
        const tasteOverlap = restaurant.tasteTags.filter((tag) => likedTags.has(tag)).length;
        const distanceScore = Math.max(0, 60 - restaurant.distance);
        const randomScore = getStableRandomScore(restaurant.id);

        return {
          restaurant,
          sortScore: distanceScore + tasteOverlap * 12 + randomScore
        };
      })
      .sort((a, b) => b.sortScore - a.sortScore)
      .map((item) => item.restaurant);
  }, [ratings]);

  useEffect(() => {
    feedRef.current?.scrollTo({ top: 0 });
  }, []);

  return (
    <section className="feed-section">
      <div className="browse-header">
        <div>
          <p className="eyebrow">Nearby video reviews</p>
          <h2>Food Feed</h2>
        </div>
      </div>

      <div ref={feedRef} className="feed-list" aria-label="Short-form restaurant feed">
        {feedRestaurants.map((restaurant) => {
          const isSaved = savedIds.has(restaurant.id);

          return (
            <article key={restaurant.id} className="feed-item">
              <TikTokEmbed url={restaurant.tiktokUrl} title={restaurant.name} />

              <div className="feed-gradient" aria-hidden="true" />

              <div className="feed-panel">
                <p className="eyebrow">{restaurant.cuisine}</p>
                <h3>{restaurant.name}</h3>
                <p className="feed-dish">{restaurant.mustTryDish}</p>
                <p className="feed-description">{restaurant.notes}</p>

                <div className="feed-meta">
                  <span>
                    <MapPin size={15} aria-hidden="true" />
                    {restaurant.distance.toFixed(1)} mi
                  </span>
                  <span>
                    <Star size={15} aria-hidden="true" />
                    {restaurant.rating.toFixed(1)}
                  </span>
                  <span>{restaurant.priceRange}</span>
                </div>
              </div>

              <div className="feed-actions" aria-label={`${restaurant.name} actions`}>
                <button
                  type="button"
                  className={isSaved ? "feed-action-button saved" : "feed-action-button"}
                  onClick={() => onToggleSaved(restaurant.id)}
                  aria-pressed={isSaved}
                >
                  <Bookmark size={22} aria-hidden="true" />
                  <span>{isSaved ? "Saved" : "Save"}</span>
                </button>
                <div className="feed-rating-row">
                  <StarRating
                    value={ratings[restaurant.id] ?? 0}
                    onChange={(rating) => onRateRestaurant(restaurant.id, rating)}
                    label={`Rate ${restaurant.name}`}
                  />
                  <span>Rate</span>
                </div>
                <button
                  type="button"
                  className="feed-action-button"
                  onClick={() => onViewRestaurant(restaurant)}
                >
                  <Info size={22} aria-hidden="true" />
                  <span>Details</span>
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
