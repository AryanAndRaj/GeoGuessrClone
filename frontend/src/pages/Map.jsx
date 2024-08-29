import {useNavigate} from "react-router-dom";
const Map = () => {
  const navigate = useNavigate();
  return (
    <div>
      <h1>GeoGuessr Clone</h1>
      <button onClick={() => navigate("/")}>Auth</button>
      <button onClick={() => navigate("/game")}>Game</button>
    </div>
  );
};

export default Map;
