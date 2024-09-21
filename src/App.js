import React from "react";
import { Routes, Route } from "react-router-dom";
import Connexion from "./pages/connexion/connexion";
import Transcription from "./pages/transcriptionList/transcriptionList";
import About from "./pages/aboutUs/aboutUs";
import LandingPage from "./pages/landingpage/landingPage";
import Header from "./components/header/header";
import Footer from "./components/footer/footer";
import NewTranscritpion from "./pages/newTranscritpion/newTranscription";
import Profil from "./pages/profile/profile";
import Souscriptions from "./pages/subscritpions/subscriptions";
import Inscription from "./pages/inscription/inscription";
import ResetPassword from "./pages/resetPassword/resetPassword";
import ForgotPassword from "./pages/forgotPassword/forgotPassword";

function App() {
  return (
    <div>
      <Header />
      <main>
        <div className="content">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/connexion" element={<Connexion />} />
            <Route path="/inscription" element={<Inscription />} />
            <Route path="/transcription" element={<Transcription />} />
            <Route path="/about" element={<About />} />
            <Route path="/newtranscription" element={<NewTranscritpion />} />
            <Route path="/profile" element={<Profil />} />
            <Route path="/souscription" element={<Souscriptions />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/forgotpassword" element={<ForgotPassword />} />
          </Routes>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default App;
