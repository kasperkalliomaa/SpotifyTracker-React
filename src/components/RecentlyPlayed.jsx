import { useState } from 'react';
import Modal from './Modal';

function RecentlyPlayed({ tracks }) {
  const [showModal, setShowModal] = useState(false);
  const preview = tracks.slice(0, 5);

  const renderTrack = (item, index) => (
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
  );

  return (
    <section className="stats-section">
      <h2>Viimeksi kuunnellut</h2>
      <ol className="stats-list">
        {preview.map(renderTrack)}
      </ol>
      {tracks.length > 5 && (
        <button className="show-more-btn" onClick={() => setShowModal(true)}>
          Näytä lisää
        </button>
      )}
      {showModal && (
        <Modal title="Viimeksi kuunnellut" onClose={() => setShowModal(false)}>
          <ol className="stats-list">
            {tracks.map(renderTrack)}
          </ol>
        </Modal>
      )}
    </section>
  );
}

export default RecentlyPlayed;
