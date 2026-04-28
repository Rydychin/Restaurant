import { Sparkles, Star } from "lucide-react";
import { criticProfiles, restaurants } from "../data/restaurants.js";
import { deriveTasteTagsFromRatings } from "../utils/tasteProfile.js";
import RestaurantCard from "./RestaurantCard.jsx";

const tagPhrases = {
  affordable: "approachable prices",
  barbecue: "barbecue cravings",
  bakery: "bakery-style comfort",
  bright: "bright flavors",
  casual: "casual dining",
  chinese: "Chinese comfort dishes",
  "comfort food": "comfort food energy",
  creamy: "creamy textures",
  "date night": "date-night appeal",
  dumplings: "dumpling-friendly menus",
  "family-friendly": "family-friendly meals",
  japanese: "Japanese flavors",
  korean: "Korean barbecue flavors",
  mexican: "Mexican seafood flavors",
  noodles: "noodle dishes",
  seafood: "seafood-forward plates",
  spicy: "spicy cravings",
  umami: "strong umami flavors"
};

function humanizeTag(tag) {
  return tagPhrases[tag] ?? tag.replace("-", " ");
}

function formatList(items) {
  if (items.length <= 1) {
    return items[0] ?? "similar taste signals";
  }

  if (items.length === 2) {
    return `${items[0]} and ${items[1]}`;
  }

  return `${items.slice(0, -1).join(", ")}, and ${items.at(-1)}`;
}

function findSimilarCritic(tags) {
  return criticProfiles
    .map((critic) => ({
      critic,
      overlap: critic.tasteTags.filter((tag) => tags.includes(tag))
    }))
    .sort((a, b) => b.overlap.length - a.overlap.length)[0];
}

function buildRecommendations(ratings) {
  const userTasteTags = deriveTasteTagsFromRatings(ratings);
  const similarCritic = findSimilarCritic(userTasteTags);
  const likedRestaurants = Object.entries(ratings)
    .filter(([, rating]) => rating >= 4)
    .map(([restaurantId, rating]) => {
      const restaurant = restaurants.find((item) => item.id === restaurantId);
      return restaurant ? { ...restaurant, userRating: rating } : null;
    })
    .filter(Boolean);

  const likedTagSet = new Set(likedRestaurants.flatMap((restaurant) => restaurant.tasteTags));
  const likedIds = new Set(likedRestaurants.map((restaurant) => restaurant.id));

  return restaurants
    .filter((restaurant) => !likedIds.has(restaurant.id))
    .map((restaurant) => {
      const matchedTags = restaurant.tasteTags.filter((tag) => likedTagSet.has(tag));
      const strongestSource = likedRestaurants
        .map((likedRestaurant) => ({
          restaurant: likedRestaurant,
          overlap: restaurant.tasteTags.filter((tag) =>
            likedRestaurant.tasteTags.includes(tag)
          )
        }))
        .sort((a, b) => b.overlap.length - a.overlap.length)[0];

      return {
        restaurant,
        matchedTags,
        score: matchedTags.length,
        source: strongestSource?.restaurant,
        explanation: makeExplanation(strongestSource?.restaurant, matchedTags),
        socialProof: makeSocialProof(similarCritic?.critic, restaurant, matchedTags)
      };
    })
    .filter((recommendation) => recommendation.score > 0)
    .sort((a, b) => b.score - a.score || b.restaurant.rating - a.restaurant.rating)
    .slice(0, 4);
}

function makeExplanation(source, matchedTags) {
  const phrases = matchedTags.slice(0, 4).map(humanizeTag);
  const sourceName = source?.name ?? "places you rated highly";

  return `Recommended because you rated ${sourceName} highly. Both offer ${formatList(phrases)}.`;
}

function makeSocialProof(critic, restaurant, matchedTags) {
  const criticPick = critic?.topRestaurants.includes(restaurant.id);
  const tagPhrase = formatList(matchedTags.slice(0, 2).map(humanizeTag));

  if (criticPick && critic) {
    return `People with similar taste also liked ${restaurant.name}; it appears on ${critic.name}'s top list.`;
  }

  if (critic) {
    return `Popular among users who enjoy ${tagPhrase}, similar to ${critic.name}'s taste profile.`;
  }

  return `People with similar taste also liked ${restaurant.name}.`;
}

export default function TasteMatch({
  ratings,
  savedIds,
  onRateRestaurant,
  onToggleSaved,
  onViewDetails
}) {
  const recommendations = buildRecommendations(ratings);
  const ratedRestaurants = Object.entries(ratings)
    .map(([restaurantId, rating]) => {
      const restaurant = restaurants.find((item) => item.id === restaurantId);
      return restaurant ? { restaurant, rating } : null;
    })
    .filter(Boolean)
    .sort((a, b) => b.rating - a.rating);

  return (
    <section className="taste-section">
      <div className="browse-header">
        <div>
          <p className="eyebrow">Rule-based prototype</p>
          <h2>Taste Match</h2>
        </div>
      </div>

      <div className="taste-layout">
        <aside className="taste-profile" aria-label="Sample user ratings">
          <div className="taste-profile-header">
            <Sparkles size={18} aria-hidden="true" />
            <h3>Your taste signals</h3>
          </div>
          {ratedRestaurants.map(({ restaurant, rating }) => (
            <div key={restaurant.id} className="rating-row">
              <span>{restaurant.name}</span>
              <strong>
                <Star size={15} aria-hidden="true" />
                {rating}
              </strong>
            </div>
          ))}
          {ratedRestaurants.length === 0 && (
            <p className="taste-empty">Rate a few restaurants to shape your matches.</p>
          )}
        </aside>

        <div className="recommendation-list">
          {recommendations.map(({ restaurant, explanation, socialProof }) => (
            <div key={restaurant.id} className="recommendation-item">
              <div className="recommendation-reason">
                <p>{explanation}</p>
                <small>{socialProof}</small>
              </div>
              <RestaurantCard
                restaurant={restaurant}
                isSaved={savedIds.has(restaurant.id)}
                onToggleSaved={onToggleSaved}
                onViewDetails={onViewDetails}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
