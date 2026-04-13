function TopTracks({ tracks }) {
  return (
    <section className="stats-section">
      <h2>Top-kappaleet</h2>
      <ol className="stats-list">
        {tracks.map((track, index) => (
          <li key={track.id} className="stats-item">
            <span className="rank">#{index + 1}</span>
            {track.album?.images?.[2] && (
              <img
                src={track.album.images[2].url}
                alt={track.name}
                className="stats-image"
              />
            )}
            <div className="stats-info">
              <span className="stats-name">{track.name}</span>
              <span className="stats-detail">
                {track.artists.map((a) => a.name).join(', ')}
              </span>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

export default TopTracks;
