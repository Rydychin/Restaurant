import { Star } from "lucide-react";

export default function StarRating({ value = 0, onChange, label = "Rate restaurant" }) {
  return (
    <div className="star-rating" aria-label={label}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className={star <= value ? "star-button filled" : "star-button"}
          onClick={() => onChange(star)}
          aria-label={`${star} star${star === 1 ? "" : "s"}`}
          aria-pressed={star === value}
        >
          <Star size={18} aria-hidden="true" />
        </button>
      ))}
    </div>
  );
}
