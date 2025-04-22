import { Routes, Route } from "react-router-dom";
import PrivateRoutes from "./PrivateRoutes";
import Login from "../pages/Login";
import useAuthStore from "../store/isAuth";
import Layout from "./Layout";
import Dashboard from "../pages/Dashboard";
import Profile from "../pages/Profile";
import Libraries from "../pages/Libraries";
import LibraryDetail from "../pages/LibraryDetail";
import Books from "../pages/Books";
import BookDetail from "../pages/BookDetail";
import NotFound from "../pages/NotFound";

const RouteApp = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<Layout />}>
        <Route element={<PrivateRoutes isAuthenticated={isAuthenticated} />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/libraries" element={<Libraries />} />
          <Route path="/librarydetail" element={<LibraryDetail />} />
          <Route path="/books" element={<Books />} />
          <Route path="/books/:id" element={<BookDetail />} />
        </Route>
      </Route>  
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default RouteApp;
