import { useState } from 'react';
import Modal from './Modal';

function TopTracks({ tracks }) {
  const [showModal, setShowModal] = useState(false);
  const preview = tracks.slice(0, 5);

  const renderTrack = (track, index) => (
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
  );

  return (
    <section className="stats-section">
      <h2>Top-kappaleet</h2>
      <ol className="stats-list">
        {preview.map(renderTrack)}
      </ol>
      {tracks.length > 5 && (
        <button className="show-more-btn" onClick={() => setShowModal(true)}>
          Näytä lisää
        </button>
      )}
      {showModal && (
        <Modal title="Top-kappaleet" onClose={() => setShowModal(false)}>
          <ol className="stats-list">
            {tracks.map(renderTrack)}
          </ol>
        </Modal>
      )}
    </section>
  );
}

export default TopTracks;
