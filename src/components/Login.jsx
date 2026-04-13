import { loginWithSpotify } from '../spotify';

function Login() {
  return (
    <div className="login-container">
      <h1>Spotify Tracker</h1>
      <p>Kirjaudu sisään nähdäksesi kuuntelutilastosi</p>
      <button onClick={loginWithSpotify}>Kirjaudu Spotifylla</button>
    </div>
  );
}

export default Login;
