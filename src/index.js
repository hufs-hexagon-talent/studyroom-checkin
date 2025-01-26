import React from "react";
import ReactDOM from "react-dom/client";
import CheckIn from "./CheckIn";

//const App = () => <div>Hello, Electron!</div>;

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <CheckIn />
  </React.StrictMode>
);
