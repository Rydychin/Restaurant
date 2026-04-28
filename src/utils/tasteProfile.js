import { restaurants } from "../data/restaurants.js";

export function getRestaurantById(id) {
  return restaurants.find((restaurant) => restaurant.id === id);
}

export function deriveTasteTagsFromRatings(ratings, minimumRating = 4) {
  const tagCounts = new Map();

  Object.entries(ratings).forEach(([restaurantId, rating]) => {
    if (rating < minimumRating) {
      return;
    }

    const restaurant = getRestaurantById(restaurantId);
    restaurant?.tasteTags.forEach((tag) => {
      tagCounts.set(tag, (tagCounts.get(tag) ?? 0) + 1);
    });
  });

  return [...tagCounts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([tag]) => tag);
}

export function getRestaurantsByIds(ids) {
  return ids.map(getRestaurantById).filter(Boolean);
}
