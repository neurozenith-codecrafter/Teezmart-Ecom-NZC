import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import Auth from "./Services/Auth";
import "./App.css";
import ProductPage from "./Pages/ProductPage";
import ScrollToTop from "./constants/ScrollToTop";

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Auth />} />
        <Route path="/product/:id" element={<ProductPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
