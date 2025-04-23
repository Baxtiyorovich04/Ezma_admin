import React from "react";
import "./scss/main.scss";
import RouteApp from "./routes";
import ThemeProvider from "./components/ThemeProvider";

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <RouteApp />
    </ThemeProvider>
  );
};

export default App;
