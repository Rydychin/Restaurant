import { Bookmark, ChefHat, MapPin, Sparkles, Star } from "lucide-react";
import TikTokEmbed from "./TikTokEmbed.jsx";

export default function RestaurantCard({
  restaurant,
  isSaved = false,
  onToggleSaved,
  onViewDetails,
  showDistance = false,
  compact = false
}) {
  const visibleVibes = compact ? restaurant.vibes.slice(0, 2) : restaurant.vibes;

  return (
    <article className={compact ? "restaurant-card compact-card" : "restaurant-card"}>
      {compact ? (
        <button
          type="button"
          className="card-image-button"
          onClick={() => onViewDetails?.(restaurant)}
          aria-label={`View details for ${restaurant.name}`}
        >
          <img
            src={restaurant.imageUrl}
            alt={`${restaurant.mustTryDish} at ${restaurant.name}`}
            onError={(event) => {
              event.currentTarget.src =
                "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=900&q=80";
            }}
          />
          <span>{restaurant.area}</span>
        </button>
      ) : (
        <TikTokEmbed url={restaurant.tiktokUrl} title={restaurant.name} />
      )}

      <div className="card-body">
        <div className="card-title-row">
          <div>
            {onViewDetails ? (
              <button
                type="button"
                className="restaurant-name-button"
                onClick={() => onViewDetails(restaurant)}
              >
                {restaurant.name}
              </button>
            ) : (
              <h2>{restaurant.name}</h2>
            )}
            <p>{restaurant.cuisine}</p>
            {compact && (
              <div className="compact-meta-line" aria-label={`${restaurant.priceRange}, ${restaurant.distance.toFixed(1)} miles away`}>
                <span>{restaurant.priceRange}</span>
                <span>{restaurant.distance.toFixed(1)} mi</span>
              </div>
            )}
          </div>
          <div className="card-actions">
            <span className="rating-pill">
              <span className="rating-icon">
                <Star size={14} aria-hidden="true" />
              </span>
              <span>{restaurant.rating.toFixed(1)}</span>
            </span>
            {!compact && <span className="price-pill">{restaurant.priceRange}</span>}
            {showDistance && !compact && (
              <span className="distance-pill">{restaurant.distance.toFixed(1)} mi</span>
            )}
          </div>
        </div>

        {!compact && (
          <div className="location-line">
            <MapPin size={16} aria-hidden="true" />
            <span>
              {restaurant.location}
              <small>{restaurant.address}</small>
            </span>
          </div>
        )}

        <div className="detail-list">
          <p>
            <ChefHat size={16} aria-hidden="true" />
            <span>
              <strong>Must try</strong>
              {restaurant.mustTryDish}
            </span>
          </p>
          {!compact && (
            <p>
              <Sparkles size={16} aria-hidden="true" />
              <span>
                <strong>Best for</strong>
                {restaurant.bestFor}
              </span>
            </p>
          )}
        </div>

        <div className="tag-list" aria-label={`${restaurant.name} vibe tags`}>
          {visibleVibes.map((vibe) => (
            <span key={vibe}>{vibe}</span>
          ))}
        </div>

        <div className="card-footer">
          {!compact && <span>Reviewed by {restaurant.sourceCreator}</span>}
          <div className="card-footer-actions">
            <button
              type="button"
              className={isSaved ? "save-button saved" : "save-button"}
              onClick={() => onToggleSaved?.(restaurant.id)}
              aria-pressed={isSaved}
            >
              <Bookmark size={16} aria-hidden="true" />
              {isSaved ? "Saved" : "Save"}
            </button>
            {onViewDetails && (
              <button
                type="button"
                className="details-button"
                onClick={() => onViewDetails(restaurant)}
              >
                {compact ? "Details" : "View Details"}
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
