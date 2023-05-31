import { PlayerType } from "../interfaces";
import "./playController.css";
const PlayerController = (props: Props): JSX.Element => {
  const players: PlayerType[] = ["rp", "bp"];

  const listItems = players.map((row, index) => {
    return (
      <button
        key={index}
        onClick={() => props.onChange(row)}
        className={`Row ${props.player === row ? "selectedRow" : ""}`}
      >
        {row}
      </button>
    );
  });

  return <>{listItems}</>;
};

interface Props {
  player: PlayerType | string;
  onChange: (player: PlayerType) => void;
}

export { PlayerController };
