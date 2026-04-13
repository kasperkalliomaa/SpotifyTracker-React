import { useState } from 'react';
import Modal from './Modal';

function TopArtists({ artists }) {
  const [showModal, setShowModal] = useState(false);
  const preview = artists.slice(0, 5);

  const renderArtist = (artist, index) => (
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
  );

  return (
    <section className="stats-section">
      <h2>Top-artistit</h2>
      <ol className="stats-list">
        {preview.map(renderArtist)}
      </ol>
      {artists.length > 5 && (
        <button className="show-more-btn" onClick={() => setShowModal(true)}>
          Näytä lisää
        </button>
      )}
      {showModal && (
        <Modal title="Top-artistit" onClose={() => setShowModal(false)}>
          <ol className="stats-list">
            {artists.map(renderArtist)}
          </ol>
        </Modal>
      )}
    </section>
  );
}

export default TopArtists;
