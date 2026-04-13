import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getUserProfile,
  getTopArtists,
  getTopTracks,
  getRecentlyPlayed,
  logout,
  isLoggedIn,
} from '../spotify';
import TopArtists from './TopArtists';
import TopTracks from './TopTracks';
import RecentlyPlayed from './RecentlyPlayed';

function Dashboard() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [topArtists, setTopArtists] = useState([]);
  const [topTracks, setTopTracks] = useState([]);
  const [recentlyPlayed, setRecentlyPlayed] = useState([]);
  const [timeRange, setTimeRange] = useState('long_term');
  const [loading, setLoading] = useState(true);

  const timeRangeLabels = {
    short_term: 'Viimeiset 4 viikkoa',
    medium_term: 'Viimeiset 6 kuukautta',
    long_term: 'Kaikki ajat',
  };

  useEffect(() => {
    if (!isLoggedIn()) {
      navigate('/');
      return;
    }

    async function fetchData() {
      setLoading(true);
      try {
        const [profileData, artists, tracks, recent] = await Promise.all([
          getUserProfile(),
          getTopArtists(timeRange, 20),
          getTopTracks(timeRange, 20),
          getRecentlyPlayed(50),
        ]);
        setProfile(profileData);
        setTopArtists(artists);
        setTopTracks(tracks);
        setRecentlyPlayed(recent);
      } catch (err) {
        console.error('Virhe haettaessa dataa:', err);
        if (err.response?.status === 401) {
          logout();
          navigate('/');
        }
      }
      setLoading(false);
    }

    fetchData();
  }, [timeRange, navigate]);

  function handleLogout() {
    logout();
    navigate('/');
  }

  if (loading) return <p>Ladataan tilastoja...</p>;

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div>
          <h1>Spotify Tracker</h1>
          {profile && (
            <p className="welcome">
              Tervetuloa, {profile.display_name}!
            </p>
          )}
        </div>
        <button onClick={handleLogout}>Kirjaudu ulos</button>
      </header>

      <div className="time-range-selector">
        {Object.entries(timeRangeLabels).map(([value, label]) => (
          <button
            key={value}
            className={timeRange === value ? 'active' : ''}
            onClick={() => setTimeRange(value)}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="stats-grid">
        <TopArtists artists={topArtists} />
        <TopTracks tracks={topTracks} />
        <RecentlyPlayed tracks={recentlyPlayed} />
      </div>
    </div>
  );
}

export default Dashboard;
