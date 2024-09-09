import React, { useState, useEffect } from 'react';
import './index.css';
import { useNavigate } from 'react-router-dom';

function Profil() {
  const [user, setUser] = useState({
    username: '',
    email: '',
  });

  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('userConnected');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser({
        username: parsedUser.user.username,
        email: parsedUser.user.email,
      });
    }
    else{
        navigate('/connexion');
    }
  }, []);

  return (
    <div className="profil-container">
      <h2 className="profil-title">Profil</h2>

      {/* Afficher les informations de l'utilisateur */}
      <p className="profil-info"><strong>Username:</strong> {user.username}</p>
      <p className="profil-info"><strong>Email:</strong> {user.email}</p>
    </div>
  );
}

export default Profil;