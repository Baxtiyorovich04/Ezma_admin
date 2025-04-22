import { Routes, Route } from "react-router-dom";
import PrivateRoutes from "./PrivateRoutes";
import Login from "../pages/Login";
const RouteApp = () => {
  const isAuthenticated = false;
  return (
    <Routes>
      <Route path="/login" element={<Login/>} />
      <Route element={<PrivateRoutes isAuthenticated={isAuthenticated} />}>
        <Route path="/" element={<Login/>} />
        <Route path="/dashboard" element={<Login/>} />
      </Route>
      <Route path="*" element={<Login/>} />
    </Routes>
  );
};

export default RouteApp;
