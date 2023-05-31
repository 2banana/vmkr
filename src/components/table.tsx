import { ExtendedMarker } from "../features/player/interfaces/interfaces";

interface TableProps {
  markers: ExtendedMarker[];
  onPlay: (data: CallbackProps) => void;
}

interface CallbackProps {
  start: number;
  end: number;
}

const Table = (props: TableProps) => {
  const pairedMarkers = props.markers.map((marker, index, array) => {
    if (index % 2 === 0 && index + 1 < array.length) {
      const startKeyframe = marker.time;
      const endKeyframe = array[index + 1].time;
      return (
        <tr key={index}>
          <td>{`${startKeyframe.toFixed(2)} - ${endKeyframe.toFixed(2)} `}</td>
          <td>{marker.skill}</td>
          <td>{marker.skill}</td>
          <td>
            <button
              onClick={() =>
                props.onPlay({ start: startKeyframe, end: endKeyframe })
              }
            >
              play
            </button>
          </td>
        </tr>
      );
    }
    return null;
  });

  return (
    <table>
      <thead>
        <tr>
          <th>XyGYgh</th>
          <th>player</th>
          <th>skill</th>
          <th>go to frame</th>
        </tr>
      </thead>
      <tbody>{pairedMarkers}</tbody>
    </table>
  );
};

export { Table };

export type { CallbackProps };
