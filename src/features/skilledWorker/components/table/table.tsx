import { ExportedSequence } from "../../interfaces";
import "./Table.css";

interface TableProps {
  markers: ExportedSequence[];
  onPlay: (data: CallbackProps) => void;
  id: string;
  renderStatusColumn?: (marker: ExportedSequence) => React.ReactNode;
}

interface CallbackProps {
  start: number;
  end: number;
  id: string;
}

const Table = (props: TableProps): JSX.Element => {
  const pairedMarkers = props.markers.map((marker, index) => {
    return (
      <tr
        key={index}
        className={`dynamicTables ${props.id === marker.id ? "selected" : ""}`}
      >
        <td>{`${marker.from.time.toFixed(2)} - ${marker.to.time.toFixed(
          2
        )} `}</td>
        <td>{marker.player}</td>
        <td>{marker.skill}</td>

        <td>
          <button
            onClick={() =>
              props.onPlay({
                start: marker.from.time,
                end: marker.to.time,
                id: marker.id,
              })
            }
          >
            play
          </button>
        </td>
        {props.renderStatusColumn && (
          <td>{props.renderStatusColumn(marker)}</td>
        )}
      </tr>
    );
  });

  return (
    <table className="custom-table">
      <thead>
        <tr>
          <th>XyGYgh</th>
          <th>player</th>
          <th>skill</th>
          <th>go to frame</th>
          {props.renderStatusColumn && <th>Status</th>}
        </tr>
      </thead>
      <tbody>{pairedMarkers}</tbody>
    </table>
  );
};

export { Table };

export type { CallbackProps, TableProps };
