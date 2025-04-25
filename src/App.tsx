import React from "react";
import "./scss/main.scss";
import RouteApp from "./routes";
import ThemeProvider from "./components/ThemeProvider";
import { Toaster } from "sonner";

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <Toaster position="top-right" />

      <RouteApp />
    </ThemeProvider>
  );
};

export default App;
