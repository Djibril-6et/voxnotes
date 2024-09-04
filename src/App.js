import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Connexion from "./pages/connexion";
import Transcription from "./pages/transcriptionList";
import About from "./pages/aboutUs";
import LandingPage from "./pages/landingpage";
import Header from "./components/header";
import Footer from "./components/footer";
import NewTranscritpion from "./pages/newTranscritpion";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <div>
      <Header isAuthenticated={isAuthenticated} />
      <main>
        <div className="content">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route
              path="/connexion"
              element={<Connexion setIsAuthenticated={setIsAuthenticated} />}
            />
            <Route
              path="/transcription"
              element={isAuthenticated ? <Transcription /> : <LandingPage />}
            />
            <Route path="/about" element={<About />} />
            <Route path="/newtranscription" element={<NewTranscritpion />} />
          </Routes>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default App;
