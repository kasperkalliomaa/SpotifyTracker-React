import axios from 'axios';

const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const REDIRECT_URI = import.meta.env.VITE_SPOTIFY_REDIRECT_URI;
const AUTH_ENDPOINT = 'https://accounts.spotify.com/authorize';
const TOKEN_ENDPOINT = 'https://accounts.spotify.com/api/token';
const API_BASE = 'https://api.spotify.com/v1';

const SCOPES = [
  'user-top-read',
  'user-read-recently-played',
  'user-read-private',
  'user-library-read',
].join(' ');

// Generate random string for PKCE
function generateRandomString(length) {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const values = crypto.getRandomValues(new Uint8Array(length));
  return values.reduce((acc, x) => acc + possible[x % possible.length], '');
}

// PKCE code verifier & challenge
async function generateCodeChallenge(codeVerifier) {
  const data = new TextEncoder().encode(codeVerifier);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

// Redirect user to Spotify login
export async function loginWithSpotify() {
  const codeVerifier = generateRandomString(64);
  const codeChallenge = await generateCodeChallenge(codeVerifier);
  localStorage.setItem('code_verifier', codeVerifier);

  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    response_type: 'code',
    redirect_uri: REDIRECT_URI,
    scope: SCOPES,
    code_challenge_method: 'S256',
    code_challenge: codeChallenge,
  });

  window.location.href = `${AUTH_ENDPOINT}?${params.toString()}`;
}

// Exchange auth code for access token
export async function getAccessToken(code) {
  const codeVerifier = localStorage.getItem('code_verifier');

  const response = await axios.post(
    TOKEN_ENDPOINT,
    new URLSearchParams({
      client_id: CLIENT_ID,
      grant_type: 'authorization_code',
      code,
      redirect_uri: REDIRECT_URI,
      code_verifier: codeVerifier,
    }),
    { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
  );

  const { access_token, refresh_token, expires_in } = response.data;
  localStorage.setItem('access_token', access_token);
  localStorage.setItem('refresh_token', refresh_token);
  localStorage.setItem('token_expiry', Date.now() + expires_in * 1000);

  return access_token;
}

// Refresh expired token
export async function refreshAccessToken() {
  const refreshToken = localStorage.getItem('refresh_token');
  if (!refreshToken) return null;

  const response = await axios.post(
    TOKEN_ENDPOINT,
    new URLSearchParams({
      client_id: CLIENT_ID,
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    }),
    { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
  );

  const { access_token, expires_in } = response.data;
  localStorage.setItem('access_token', access_token);
  localStorage.setItem('token_expiry', Date.now() + expires_in * 1000);

  return access_token;
}

// Get valid token (refresh if needed)
async function getValidToken() {
  const expiry = localStorage.getItem('token_expiry');
  if (Date.now() > Number(expiry) - 60000) {
    return await refreshAccessToken();
  }
  return localStorage.getItem('access_token');
}

// Create authenticated axios instance
async function api() {
  const token = await getValidToken();
  return axios.create({
    baseURL: API_BASE,
    headers: { Authorization: `Bearer ${token}` },
  });
}

// ---- API calls ----

export async function getUserProfile() {
  const client = await api();
  const { data } = await client.get('/me');
  return data;
}

export async function getTopArtists(timeRange = 'long_term', limit = 20) {
  const client = await api();
  const { data } = await client.get('/me/top/artists', {
    params: { time_range: timeRange, limit },
  });
  return data.items;
}

export async function getTopTracks(timeRange = 'long_term', limit = 20) {
  const client = await api();
  const { data } = await client.get('/me/top/tracks', {
    params: { time_range: timeRange, limit },
  });
  return data.items;
}

export async function getRecentlyPlayed(limit = 50) {
  const client = await api();
  const { data } = await client.get('/me/player/recently-played', {
    params: { limit },
  });
  return data.items;
}

export function logout() {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('token_expiry');
  localStorage.removeItem('code_verifier');
}

export function isLoggedIn() {
  return !!localStorage.getItem('access_token');
}
