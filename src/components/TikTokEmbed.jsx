import { ExternalLink } from "lucide-react";

function getTikTokVideoId(url) {
  const match = url.match(/\/video\/(\d+)/);
  return match?.[1] ?? null;
}

export default function TikTokEmbed({ url, title }) {
  const videoId = getTikTokVideoId(url);
  const embedUrl = videoId ? `https://www.tiktok.com/embed/v2/${videoId}` : null;

  return (
    <div className="tiktok-shell">
      {embedUrl ? (
        <iframe
          title={`${title} TikTok review`}
          src={embedUrl}
          loading="lazy"
          allow="encrypted-media; fullscreen; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <div className="embed-placeholder">
          <span>TikTok embed</span>
        </div>
      )}

      <a href={url} target="_blank" rel="noreferrer" className="tiktok-link">
        View on TikTok
        <ExternalLink size={14} aria-hidden="true" />
      </a>
    </div>
  );
}
