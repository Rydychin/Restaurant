import { Compass, Map, Sparkles, User, Video } from "lucide-react";

const tabs = [
  { id: "explore", label: "Explore", icon: Compass },
  { id: "map", label: "Map", icon: Map },
  { id: "feed", label: "Food Feed", icon: Video },
  { id: "taste", label: "Taste Match", icon: Sparkles },
  { id: "profile", label: "Profile", icon: User }
];

export default function NavigationTabs({ activeTab, onChange }) {
  return (
    <nav className="navigation-tabs" aria-label="Main sections">
      {tabs.map((tab) => {
        const Icon = tab.icon;

        return (
          <button
            key={tab.id}
            type="button"
            className={activeTab === tab.id ? "tab-button active" : "tab-button"}
            onClick={() => onChange(tab.id)}
          >
            <Icon size={15} aria-hidden="true" />
            {tab.label}
          </button>
        );
      })}
    </nav>
  );
}
