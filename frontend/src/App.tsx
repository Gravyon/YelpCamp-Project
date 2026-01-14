import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Campgrounds from "./pages/campgrounds/Index";
import CampgroundForm from "./pages/campgrounds/New";
import Campground from "./pages/campgrounds/Details";
import UpdateCampground from "./pages/campgrounds/Edit";
import MainNavbar from "./components/layout/MainNavbar";
import Footer from "./components/layout/Footer";
import NotFound from "./pages/NotFound";
import { Toaster } from "react-hot-toast";
import Register from "./pages/Register";
import Login from "./pages/Login";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { useEffect } from "react";
import { useUserStore } from "./store/userStore";
import { PublicRoute } from "./components/auth/PublicRoute";
function App() {
  const { checkAuth } = useUserStore();
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <main className="d-flex flex-column vh-100">
      <MainNavbar />
      <Toaster position="top-right" reverseOrder={false} />
      <section className="container mt-5">
        <Routes>
          <Route path="*" element={<NotFound />} />
          <Route path="/" element={<Home />} />
          <Route element={<PublicRoute />}>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
          </Route>
          <Route path="/campgrounds" element={<Campgrounds />} />
          <Route path="/campgrounds/:id" element={<Campground />} />
          <Route element={<ProtectedRoute />}>
            <Route
              path="/campgrounds/:id/edit"
              element={<UpdateCampground />}
            />
            <Route path="/campgrounds/create" element={<CampgroundForm />} />
          </Route>
        </Routes>
      </section>
      <Footer />
    </main>
  );
}

export default App;
