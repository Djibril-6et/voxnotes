import React from 'react';
import './index.css';
import VoxNotesLogo from "../../assets/voxNotes.png"

function LandingBanner() {
  return (
    <div className="landing-banner">
      <div className="banner-content">
        <img src={VoxNotesLogo} alt="Logo" className="banner-logo" />
        <h1 className="banner-sub-title">
          Bienvenue <br /> sur
        </h1>
        <h1 className="banner-title">
          VoxNotes !
        </h1>
      </div>
    </div>
  );
}

export default LandingBanner;
