import { SlidersHorizontal } from "lucide-react";

export default function FilterBar({ filters, options, onChange, resultCount }) {
  return (
    <section className="filter-bar" aria-label="Restaurant filters">
      <div className="filter-heading">
        <SlidersHorizontal size={18} aria-hidden="true" />
        <span>Filters</span>
      </div>

      <label>
        Cuisine
        <select
          value={filters.cuisine}
          onChange={(event) => onChange("cuisine", event.target.value)}
        >
          {options.cuisines.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>

      <label>
        Price
        <select
          value={filters.priceRange}
          onChange={(event) => onChange("priceRange", event.target.value)}
        >
          {options.priceRanges.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>

      <label>
        Area
        <select
          value={filters.area}
          onChange={(event) => onChange("area", event.target.value)}
        >
          {options.areas.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>

      <label>
        Vibe
        <select
          value={filters.vibe}
          onChange={(event) => onChange("vibe", event.target.value)}
        >
          {options.vibes.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>

      <label>
        Rating
        <select
          value={filters.rating}
          onChange={(event) => onChange("rating", event.target.value)}
        >
          {options.ratingOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>

      <p className="result-count">{resultCount} spots</p>
    </section>
  );
}
