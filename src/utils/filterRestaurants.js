export const defaultRestaurantFilters = {
  cuisine: "All",
  priceRange: "All",
  area: "All",
  vibe: "All",
  rating: "All"
};

function getMinimumRating(option) {
  return option === "All" ? 0 : Number(option.replace("+", ""));
}

export function filterRestaurants(restaurants, filters, searchTerm) {
  const query = searchTerm.trim().toLowerCase();
  const minimumRating = getMinimumRating(filters.rating);

  return restaurants.filter((restaurant) => {
    const matchesCuisine =
      filters.cuisine === "All" || restaurant.cuisine === filters.cuisine;
    const matchesPrice =
      filters.priceRange === "All" || restaurant.priceRange === filters.priceRange;
    const matchesArea = filters.area === "All" || restaurant.area === filters.area;
    const matchesVibe =
      filters.vibe === "All" || restaurant.vibes.includes(filters.vibe);
    const matchesRating = restaurant.rating >= minimumRating;
    const searchableText = [
      restaurant.name,
      restaurant.cuisine,
      restaurant.location,
      restaurant.area,
      restaurant.address,
      restaurant.mustTryDish,
      restaurant.bestFor,
      restaurant.sourceCreator,
      restaurant.vibes.join(" "),
      restaurant.tasteTags.join(" ")
    ]
      .join(" ")
      .toLowerCase();
    const matchesSearch = query === "" || searchableText.includes(query);

    return (
      matchesCuisine &&
      matchesPrice &&
      matchesArea &&
      matchesVibe &&
      matchesRating &&
      matchesSearch
    );
  });
}
