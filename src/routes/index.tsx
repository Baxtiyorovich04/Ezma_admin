import { Routes, Route, Navigate } from "react-router-dom";
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
import Settings from "../pages/Settings";
import AddLibrary from "../pages/AddLibrary";
import MostSearched from "../pages/MostSearched";

const RouteApp = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <Routes>
      {!isAuthenticated ? (
        <>
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </>
      ) : (
        <Route element={<Layout />}>
          <Route element={<PrivateRoutes isAuthenticated={isAuthenticated} />}>
            <Route path="/" element={<Libraries />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/libraries" element={<Libraries />} />
            <Route path="/librarydetail/:id" element={<LibraryDetail />} />
            <Route path="/books" element={<Books />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/addlibrary" element={<AddLibrary />} />
            <Route path="/mostsearched" element={<MostSearched />} />
            <Route path="/books/:id" element={<BookDetail />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Route>
      )}
    </Routes>
  );
};

export default RouteApp;
