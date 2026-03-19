import { Routes, Route } from "react-router-dom";
import "./App.css";
import { NavBar } from "./features/user/components/Navbar";
import { LoginPage } from "./pages/users/LoginPage";
import { RegisterPage } from "./pages/users/RegisterPage";
import { HomePage } from "./features/HomePage";
import { JobsPage } from "./pages/jobs/JobsPage";
function App() {
  return (
    <>
      <NavBar /> 
      <Routes>
        <Route path="/" element={<HomePage/>} />
        <Route path="/jobs" element={<JobsPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </>
  );
}

export default App;
