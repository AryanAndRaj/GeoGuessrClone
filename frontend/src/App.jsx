import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Landing from "./pages/landing";
import Game from "./pages/game";

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/game" element={<Game />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
