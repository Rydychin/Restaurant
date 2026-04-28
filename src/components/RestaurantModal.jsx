import { Bookmark, X } from "lucide-react";
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
          <p className="eyebrow">{restaurant.cuisine}</p>
          <h2 id="restaurant-modal-title">{restaurant.name}</h2>
          <p>{restaurant.notes}</p>

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
              <dt>Address</dt>
              <dd>{restaurant.address}</dd>
            </div>
            <div>
              <dt>Rating</dt>
              <dd>{restaurant.rating.toFixed(1)} stars</dd>
            </div>
            <div>
              <dt>Must try</dt>
              <dd>{restaurant.mustTryDish}</dd>
            </div>
            <div>
              <dt>Best for</dt>
              <dd>{restaurant.bestFor}</dd>
            </div>
            <div>
              <dt>Tags</dt>
              <dd>{restaurant.tasteTags.join(", ")}</dd>
            </div>
          </dl>
        </div>
      </section>
    </div>
  );
}
