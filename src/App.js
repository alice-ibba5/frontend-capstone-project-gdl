import "./App.css";
import NavBar from "./components/Navbar/Navbar.js";
import HomeSlog from "./components/Homepage-sloggati/HomeSlog.js";
import HomeLog from "./components/Homepage-loggati/HomeLog.js";
import ChiSiamo from "./components/ChiSiamo.js";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" exact element={<HomeSlog />} />
        <Route path="/gdl" element={<HomeLog />} />
        <Route path="/chi-siamo" element={<ChiSiamo />} />
        {/*<Route path="/register" element={<Registration />} /> */}
      </Routes>
      {/* <Footer /> */}
    </Router>
  );
}

export default App;
