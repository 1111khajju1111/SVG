import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

// Route-level code splitting: each page becomes its own JS chunk instead of
// all of them (plus three.js/drei, pulled in by Home -> Hero3D) shipping in
// one bundle on first load. This is most of the "everything feels slow"
// complaint — the old bundle downloaded and parsed the 3D library before a
// visitor could even see the shop or login page.
const Home = lazy(() => import("./pages/Home"));
const Shop = lazy(() => import("./pages/Shop"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const Cart = lazy(() => import("./pages/Cart"));
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));

export default function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen font-body">
        <Navbar />
        <Suspense fallback={<div className="min-h-screen" />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute adminOnly>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route path="/contact" element={<Home />} />
          </Routes>
        </Suspense>
        <Footer />
      </div>
    </ThemeProvider>
  );
}
