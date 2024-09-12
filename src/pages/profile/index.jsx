import React, { useState, useEffect } from 'react';
import './index.css';
import { useNavigate, useLocation } from 'react-router-dom';

function Profil() {
  const [user, setUser] = useState({
    username: '',
    email: '',
  });

  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const username = queryParams.get('username');
  const email = queryParams.get('email');
  //const provider = queryParams.get('provider');

  useEffect(() => {
    if (username && email) {
      const userData = { username, email };
      localStorage.setItem('userConnected', JSON.stringify({ user: userData }));
      setUser(userData);
    }
    else{
        const storedUser = localStorage.getItem('userConnected');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser({
          username: parsedUser.user.username,
          email: parsedUser.user.email,
        });
      } else {
        navigate('/connexion');
      }
    }
  }, [location, navigate]);

  const handleSignOut = async () => {
    try {
      // Call backend to destroy the session
      /* await fetch(`http://localhost:3009/auth/${provider}/signout`, {
        method: 'GET',
        credentials: 'include', // To include cookies/session information
      }); */

      // Remove user data from localStorage
      localStorage.removeItem('userConnected');
      
      // Redirect to login page
      navigate('/connexion');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="profil-container">
      <h2 className="profil-title">Profil</h2>

      {/* Afficher les informations de l'utilisateur */}
      <p className="profil-info"><strong>Username:</strong> {user.username}</p>
      <p className="profil-info"><strong>Email:</strong> {user.email}</p>

      {/* Sign Out button */}
      <button className="signout-button" onClick={handleSignOut}>
        Sign Out
      </button>
    </div>
  );
}

export default Profil;