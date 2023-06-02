import { StatusType } from "../interfaces";
import "./playController.css";
const StatusController = (props: Props): JSX.Element => {
  const statuses: StatusType[] = ["accepted", "pending", "rejected"];
  console.log(`incoming status : ${props.status}`);

  const listItems = statuses.map((row, index) => {
    return (
      <button
        key={index}
        onClick={() => props.onChange(props.id, row)}
        className={`Row ${props.status === row ? "selectedRow" : ""}`}
      >
        {row}
      </button>
    );
  });

  return <>{listItems}</>;
};

interface Props {
  id: string;
  status: StatusType;

  onChange: (id: string, status: StatusType) => void;
}

export { StatusController };
