import { Routes, Route } from "react-router-dom";
import "./App.css";
import { NavBar } from "./features/user/components/Navbar";
import { LoginPage } from "./features/user/pages/LoginPage";
import { RegisterPage } from "./features/user/pages/RegisterPage";
import { HomePage } from "./features/HomePage";
function App() {
  return (
    <>
      <NavBar /> 
      <Routes>
        <Route path="/" element={<HomePage/>} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </>
  );
}

export default App;
