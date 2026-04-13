function RecentlyPlayed({ tracks }) {
  return (
    <section className="stats-section">
      <h2>Viimeksi kuunnellut</h2>
      <ol className="stats-list">
        {tracks.map((item, index) => (
          <li key={`${item.track.id}-${item.played_at}`} className="stats-item">
            <span className="rank">#{index + 1}</span>
            {item.track.album?.images?.[2] && (
              <img
                src={item.track.album.images[2].url}
                alt={item.track.name}
                className="stats-image"
              />
            )}
            <div className="stats-info">
              <span className="stats-name">{item.track.name}</span>
              <span className="stats-detail">
                {item.track.artists.map((a) => a.name).join(', ')}
              </span>
              <span className="stats-time">
                {new Date(item.played_at).toLocaleString('fi-FI')}
              </span>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

export default RecentlyPlayed;
