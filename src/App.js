import React, { useState, useEffect } from 'react';
import Login from './Login';
import MainPage from './MainPage';
import './App.css';

function App() {

  const [token, setToken] = useState('');
  // const [playbacktoken, setPlaybackToken] = useState('');
  useEffect(() => {

    async function getToken() {
      const response = await fetch('/auth/token');
      const json = await response.json();
      setToken(json.access_token);
    }

    getToken();

  }, []);

  return (
    <>
        { (token === '') ? <Login/> : <MainPage token={token}/> }
    </>
  );
}


export default App;
