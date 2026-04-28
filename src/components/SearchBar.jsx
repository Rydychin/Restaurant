import { Search } from "lucide-react";

export default function SearchBar({ value, onChange }) {
  return (
    <label className="search-bar">
      <Search size={18} aria-hidden="true" />
      <span className="sr-only">Search restaurants</span>
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search by restaurant, cuisine, dish, or vibe"
      />
    </label>
  );
}
