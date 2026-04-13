import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAccessToken } from '../spotify';

function Callback() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');

    if (code) {
      getAccessToken(code).then(() => {
        navigate('/dashboard');
      });
    }
  }, [navigate]);

  return <p>Kirjaudutaan sisään...</p>;
}

export default Callback;
