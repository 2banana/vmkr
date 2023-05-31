import { RouterProvider } from "react-router-dom";
import "./App.css";
import { router } from "./utils/router/router";

const App = () => (
  <div className="app-container">
    <RouterProvider router={router} />
  </div>
);

export default App;
