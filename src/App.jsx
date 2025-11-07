import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import './index.css';
import HomePage from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import { useState } from "react";

export default function App() {
  const [isAuth, setIsAuth] = useState(false);
  return (

    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage isAuth={isAuth} />} />
        <Route path="/login" element={<Login setIsAuth={setIsAuth} />} />
        <Route path="/signup" element={<Signup setIsAuth={setIsAuth} />} />
      </Routes>
    </BrowserRouter>
  );
}