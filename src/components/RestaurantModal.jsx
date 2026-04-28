import { Bookmark, MapPin, Star, Utensils, Video, X } from "lucide-react";
import StarRating from "./StarRating.jsx";
import TikTokEmbed from "./TikTokEmbed.jsx";

export default function RestaurantModal({
  restaurant,
  isSaved = false,
  userRating = 0,
  onRateRestaurant,
  onToggleSaved,
  onClose
}) {
  if (!restaurant) {
    return null;
  }

  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <section
        className="restaurant-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="restaurant-modal-title"
        onClick={(event) => event.stopPropagation()}
      >
        <button type="button" className="modal-close" onClick={onClose} aria-label="Close">
          <X size={18} aria-hidden="true" />
        </button>

        <TikTokEmbed url={restaurant.tiktokUrl} title={restaurant.name} />

        <div className="modal-content">
          <div className="modal-heading">
            <p className="eyebrow">{restaurant.cuisine}</p>
            <h2 id="restaurant-modal-title">{restaurant.name}</h2>
            <p>
              <MapPin size={15} aria-hidden="true" />
              {restaurant.location}
            </p>
          </div>

          <div className="modal-summary">
            <span>
              <Star size={16} aria-hidden="true" />
              {restaurant.rating.toFixed(1)}
            </span>
            <span>{restaurant.priceRange}</span>
            <span>{restaurant.distance.toFixed(1)} mi away</span>
          </div>

          <p className="modal-notes">{restaurant.notes}</p>

          <div className="modal-actions">
            <button
              type="button"
              className={isSaved ? "save-button saved" : "save-button"}
              onClick={() => onToggleSaved?.(restaurant.id)}
              aria-pressed={isSaved}
            >
              <Bookmark size={16} aria-hidden="true" />
              {isSaved ? "Saved" : "Save"}
            </button>
            <a href={restaurant.tiktokUrl} target="_blank" rel="noreferrer" className="modal-video-link">
              <Video size={16} aria-hidden="true" />
              Open video review
            </a>
          </div>

          {onRateRestaurant && (
            <section className="modal-rating-card" aria-label={`Rate ${restaurant.name}`}>
              <div>
                <h3>Your rating</h3>
                <p>
                  {userRating > 0
                    ? `You rated this ${userRating} out of 5.`
                    : "Tap a star to rate this restaurant."}
                </p>
              </div>
              <StarRating
                value={userRating}
                onChange={(rating) => onRateRestaurant(restaurant.id, rating)}
                label={`Rate ${restaurant.name}`}
              />
            </section>
          )}

          <dl className="modal-facts">
            <div>
              <dt>Must try</dt>
              <dd>
                <Utensils size={15} aria-hidden="true" />
                {restaurant.mustTryDish}
              </dd>
            </div>
            <div>
              <dt>Best for</dt>
              <dd>{restaurant.bestFor}</dd>
            </div>
            <div>
              <dt>Address</dt>
              <dd>{restaurant.address}</dd>
            </div>
            <div>
              <dt>Source creator</dt>
              <dd>{restaurant.sourceCreator}</dd>
            </div>
            <div>
              <dt>Tags</dt>
              <dd className="modal-tag-list">
                {restaurant.tasteTags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </dd>
            </div>
          </dl>
        </div>
      </section>
    </div>
  );
}
