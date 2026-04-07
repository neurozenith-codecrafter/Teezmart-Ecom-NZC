import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import Auth from "./Services/Auth";
import "./App.css";
import ProductPage from "./Pages/ProductPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Auth />} />
        <Route path="/Product" element={<ProductPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
