import { createBrowserRouter } from "react-router-dom";
import { PlayerContainer } from "../../features/player/playerContainer";
import { SkilledWorkerContainer } from "../../features/skilledWorker/skilledContainer";
import VideoFrameExtractor from "../../features/videoExtractor/videoExtractor";
import { ManagerContainer } from "../../features/manager/managerContainer";

const router = createBrowserRouter([
  {
    path: "/",
    element: <PlayerContainer />,
  },
  {
    path: "/import",
    element: <SkilledWorkerContainer />,
  },

 
  { path: "/manager", element: <ManagerContainer /> },
]);

export { router };
