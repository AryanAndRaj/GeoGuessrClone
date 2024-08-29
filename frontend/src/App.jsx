import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Map from "./pages/Map";
import Game from "./pages/Game";
import Auth from "./pages/Auth";
function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/map" element={<Map />} />
          <Route path="/" element={<Auth />} />
          <Route path="/game" element={<Game />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
