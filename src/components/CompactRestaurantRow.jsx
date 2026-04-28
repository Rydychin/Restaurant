import { Bookmark, Star } from "lucide-react";

export default function CompactRestaurantRow({
  restaurant,
  rank,
  isSaved = false,
  rating,
  onToggleSaved,
  onViewDetails
}) {
  return (
    <button
      type="button"
      className="compact-restaurant-row"
      onClick={() => onViewDetails?.(restaurant)}
    >
      {rank && <span className="compact-rank">{rank}</span>}
      <span className="compact-main">
        <strong>{restaurant.name}</strong>
        <small>
          {restaurant.cuisine} &middot; {restaurant.area} &middot; {restaurant.priceRange}
        </small>
      </span>
      <span className="compact-meta">
        <Star size={14} aria-hidden="true" />
        {rating ?? restaurant.rating.toFixed(1)}
      </span>
      {onToggleSaved && (
        <span
          role="button"
          tabIndex={0}
          className={isSaved ? "compact-save saved" : "compact-save"}
          onClick={(event) => {
            event.stopPropagation();
            onToggleSaved(restaurant.id);
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              event.stopPropagation();
              onToggleSaved(restaurant.id);
            }
          }}
          aria-label={isSaved ? "Unsave" : "Save"}
          aria-pressed={isSaved}
        >
          <Bookmark size={15} aria-hidden="true" />
        </span>
      )}
    </button>
  );
}
