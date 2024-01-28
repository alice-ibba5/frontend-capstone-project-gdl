import "./App.css";
import NavBar from "./components/Navbar/Navbar.js";
import HomeSlog from "./components/Homepage-sloggati/HomeSlog.js";
import HomeLog from "./components/Homepage-loggati/HomeLog.js";
import GDSeries from "./components/Homepage-loggati/GDSeries/GDSeries.js";
import ChiSiamo from "./components/Homepage-loggati/ChiSiamo/ChiSiamo.js";
import NuovaProposta from "./components/Homepage-loggati/NuovaProposta.js";
import NuovoGDSeries from "./components/Homepage-loggati/NuovoGDSeries/NuovoGDSeries.js";
import GdlDetails from "./components/Gdl-details/GdlDetails.js";
import GDSeriesDetails from "./components/Homepage-loggati/GDSeriesDetails/GDSeriesDetails.js";
import Footer from "./components/Homepage-loggati/Footer/Footer.js";
import Contatti from "./components/Homepage-loggati/Contatti/Contatti.js";
import Profile from "./components/Homepage-loggati/Profile/Profile.js";
import OtherProfile from "./components/Homepage-loggati/OtherProfile/OtherProfile.js";
import PrivateRoute from "./PrivateRoute.js";
import Prova3D from "./components/Homepage-sloggati/3D.js";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";

function App() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <Router>
      <Routes>
        <Route path="/" exact element={<Prova3D />} />
        <Route
          path="/gdl"
          element={
            <PrivateRoute>
              <NavBar
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
              />
              <HomeLog searchQuery={searchQuery} />
              <Footer />
            </PrivateRoute>
          }
        />
        <Route
          path="/gdseries"
          element={
            <PrivateRoute>
              <NavBar
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
              />
              <GDSeries />
              <Footer />
            </PrivateRoute>
          }
        />
        <Route
          path="/chi-siamo"
          element={
            <PrivateRoute>
              <NavBar
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
              />
              <ChiSiamo />
              <Footer />
            </PrivateRoute>
          }
        />
        <Route
          path="/contatti"
          element={
            <PrivateRoute>
              <NavBar
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
              />
              <Contatti />
              <Footer />
            </PrivateRoute>
          }
        />
        <Route
          path="/nuova-proposta"
          element={
            <PrivateRoute>
              <NavBar
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
              />
              <NuovaProposta />
              <Footer />
            </PrivateRoute>
          }
        />
        <Route
          path="/nuovo-gdseries"
          element={
            <PrivateRoute>
              <NavBar
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
              />
              <NuovoGDSeries />
              <Footer />
            </PrivateRoute>
          }
        />
        <Route
          path="/gdl/:id"
          element={
            <PrivateRoute>
              <NavBar
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
              />
              <GdlDetails />
              <Footer />
            </PrivateRoute>
          }
        />
        <Route
          path="/gdSeries/:id"
          element={
            <PrivateRoute>
              <NavBar
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
              />
              <GDSeriesDetails />
              <Footer />
            </PrivateRoute>
          }
        />
        <Route
          path="/users/me/:id"
          element={
            <PrivateRoute>
              <NavBar
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
              />
              <Profile />
              <Footer />
            </PrivateRoute>
          }
        />
        <Route
          path="/users/:_id"
          element={
            <PrivateRoute>
              <NavBar
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
              />
              <OtherProfile />
              <Footer />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
