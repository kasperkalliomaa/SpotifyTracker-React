function TopArtists({ artists }) {
  return (
    <section className="stats-section">
      <h2>Top-artistit</h2>
      <ol className="stats-list">
        {artists.map((artist, index) => (
          <li key={artist.id} className="stats-item">
            <span className="rank">#{index + 1}</span>
            {artist.images?.[2] && (
              <img
                src={artist.images[2].url}
                alt={artist.name}
                className="stats-image"
              />
            )}
            <div className="stats-info">
              <span className="stats-name">{artist.name}</span>
              <span className="stats-detail">
                {artist.genres?.slice(0, 3).join(', ')}
              </span>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

export default TopArtists;
