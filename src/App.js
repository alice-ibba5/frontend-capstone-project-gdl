import "./App.css";
import NavBar from "./components/Navbar/Navbar.js";
import HomeSlog from "./components/Homepage-sloggati/HomeSlog.js";
import HomeLog from "./components/Homepage-loggati/HomeLog.js";
import ChiSiamo from "./components/Homepage-loggati/ChiSiamo.js";
import NuovaProposta from "./components/Homepage-loggati/NuovaProposta.js";
import GdlDetails from "./components/Gdl-details/GdlDetails.js";
import Footer from "./components/Homepage-loggati/Footer/Footer.js";
import Contatti from "./components/Homepage-loggati/Contatti/Contatti.js";
import Profile from "./components/Homepage-loggati/Profile/Profile.js";
import PrivateRoute from "./PrivateRoute.js";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";

function App() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <Router>
      <NavBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <Routes>
        <Route path="/" exact element={<HomeSlog />} />
        <Route path="/gdl" element={<HomeLog searchQuery={searchQuery} />} />
        <Route path="/chi-siamo" element={<ChiSiamo />} />
        <Route path="/contatti" element={<Contatti />} />
        <Route path="/nuova-proposta" element={<NuovaProposta />} />
        <Route path="/gdl/:id" element={<GdlDetails />} />
        <Route path="/users/:id" element={<Profile />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
