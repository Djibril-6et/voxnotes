import React from "react";
import "./footer.css";
import VoxNotesLogo from "../../assets/voxNotes.png";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-content">
        <img src={VoxNotesLogo} alt="Logo" className="footer-logo" />
        <p className="footer-text">
          &copy; {currentYear} VoxNotes. Tous droits réservés.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
