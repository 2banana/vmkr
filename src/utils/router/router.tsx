import { createBrowserRouter } from "react-router-dom";
import { PlayerContainer } from "../../features/player/playerContainer";
import { SkilledWorkerContainer } from "../../features/skilledWorker/skilledContainer";

const router = createBrowserRouter([
  {
    path: "/",
    element: <PlayerContainer />,
  },
  {
    path: "/import",
    element: <SkilledWorkerContainer />,
  },
]);

export { router };
