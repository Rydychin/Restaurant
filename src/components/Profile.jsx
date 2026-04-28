import { useMemo, useState } from "react";
import { criticProfiles, currentUser, restaurants } from "../data/restaurants.js";
import {
  deriveTasteTagsFromRatings,
  getRestaurantsByIds
} from "../utils/tasteProfile.js";
import CompactRestaurantRow from "./CompactRestaurantRow.jsx";

export default function Profile({ ratings, savedIds, onToggleSaved, onViewDetails }) {
  const [selectedProfileId, setSelectedProfileId] = useState(currentUser.id);
  const selectedCritic = criticProfiles.find((critic) => critic.id === selectedProfileId);
  const isCurrentUser = !selectedCritic;
  const profile = selectedCritic ?? currentUser;

  const derivedTags = useMemo(() => {
    return isCurrentUser
      ? deriveTasteTagsFromRatings(ratings).slice(0, 10)
      : profile.tasteTags;
  }, [isCurrentUser, profile, ratings]);

  const topRestaurants = getRestaurantsByIds(profile.topRestaurants).slice(0, 10);
  const topRestaurantCount = topRestaurants.length;
  const recentRatings = Object.entries(ratings)
    .map(([restaurantId, rating]) => ({
      restaurant: restaurants.find((item) => item.id === restaurantId),
      rating
    }))
    .filter((item) => item.restaurant)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 5);
  const savedRestaurants = restaurants.filter((restaurant) => savedIds.has(restaurant.id));
  const favoriteTasteTags = derivedTags.slice(0, 6);

  return (
    <section className="section-shell profile-section">
      <div className="profile-hero">
        <div className="profile-avatar" aria-hidden="true">
          {profile.name
            .split(" ")
            .map((part) => part[0])
            .join("")
            .slice(0, 2)}
        </div>
        <div>
          <p className="eyebrow">{isCurrentUser ? "Your profile" : "Critic profile"}</p>
          <div className="profile-title-row">
            <div>
              <h2>{profile.name}</h2>
              <span>{profile.username}</span>
            </div>
            {!isCurrentUser && <button type="button">View Critic</button>}
          </div>
          <div className="profile-stats" aria-label={`${profile.name} profile stats`}>
            <span>
              <strong>{topRestaurantCount}</strong>
              top spots
            </span>
            <span>
              <strong>{profile.followers.toLocaleString()}</strong>
              followers
            </span>
            <span>
              <strong>{profile.following.toLocaleString()}</strong>
              following
            </span>
          </div>
          <p>{profile.bio}</p>
          {favoriteTasteTags.length > 0 && (
            <div className="profile-love-strip" aria-label={`${profile.name} favorite taste tags`}>
              <span>You love</span>
              <div>
                {favoriteTasteTags.map((tag) => (
                  <strong key={tag}>{tag}</strong>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="profile-switcher" aria-label="Profile selector">
        <button
          type="button"
          className={isCurrentUser ? "profile-chip active" : "profile-chip"}
          onClick={() => setSelectedProfileId(currentUser.id)}
        >
          Your profile
        </button>
        {criticProfiles.map((critic) => (
          <button
            key={critic.id}
            type="button"
            className={selectedProfileId === critic.id ? "profile-chip active" : "profile-chip"}
            onClick={() => setSelectedProfileId(critic.id)}
          >
            {critic.name}
          </button>
        ))}
      </div>

      <div className="profile-grid">
        <section className="profile-panel top-list-panel">
          <div className="panel-heading">
            <h3>Top 10 Restaurants</h3>
            <p>Ranked favorites from this taste profile.</p>
          </div>
          <div className="compact-list">
            {topRestaurants.map((restaurant, index) => (
              <CompactRestaurantRow
                key={restaurant.id}
                restaurant={restaurant}
                rank={index + 1}
                isSaved={savedIds.has(restaurant.id)}
                onToggleSaved={onToggleSaved}
                onViewDetails={onViewDetails}
              />
            ))}
          </div>
        </section>

        <aside className="profile-side">
          <section className="profile-panel">
            <div className="panel-heading">
              <h3>Taste Profile</h3>
              <p>{isCurrentUser ? "Derived from highly rated restaurants." : "Curated critic signals."}</p>
            </div>
            <div className="taste-chip-list">
              {derivedTags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
          </section>

          {isCurrentUser && (
            <>
              <section className="profile-panel">
                <div className="panel-heading">
                  <h3>Recently Rated</h3>
                  <p>Your latest high-signal ratings.</p>
                </div>
                <div className="compact-list">
                  {recentRatings.map(({ restaurant, rating }) => (
                    <CompactRestaurantRow
                      key={restaurant.id}
                      restaurant={restaurant}
                      rating={rating}
                      onViewDetails={onViewDetails}
                    />
                  ))}
                </div>
              </section>

              <section className="profile-panel">
                <div className="panel-heading">
                  <h3>Saved Restaurants</h3>
                  <p>Places you marked for later.</p>
                </div>
                <div className="compact-list">
                  {savedRestaurants.length > 0 ? (
                    savedRestaurants.map((restaurant) => (
                      <CompactRestaurantRow
                        key={restaurant.id}
                        restaurant={restaurant}
                        isSaved
                        onToggleSaved={onToggleSaved}
                        onViewDetails={onViewDetails}
                      />
                    ))
                  ) : (
                    <p className="profile-empty">Save restaurants to build this list.</p>
                  )}
                </div>
              </section>
            </>
          )}
        </aside>
      </div>
    </section>
  );
}
