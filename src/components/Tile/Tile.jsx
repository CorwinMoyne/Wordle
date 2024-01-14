import "./Tile.css";
function Tile({ guess }) {
  return <div className={`tile ${guess.class}`}>{guess.letter}</div>;
}

export default Tile;
