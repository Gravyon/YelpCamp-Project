import { Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Campgrounds from "./components/Campgrounds";
import CampgroundForm from "./components/CreateCampground";
import Campground from "./components/Campground";
import UpdateCampground from "./components/UpdateCampground";
import MainNavbar from "./components/MainNavbar";
import Footer from "./components/Footer";
import NotFound from "./components/NotFound";
import { Toaster } from "react-hot-toast";
import Register from "./components/Register";
import Login from "./components/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import { useEffect } from "react";
import { useUserStore } from "./store/userStore";
import { PublicRoute } from "./components/PublicRoute";
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
