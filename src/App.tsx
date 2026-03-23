import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { NavBar } from "./features/user/components/Navbar";
import { HomePage } from "./features/HomePage";
import { LoginPage } from "./features/user/pages/LoginPage";
import { RegisterPage } from "./features/user/pages/RegisterPage";
import { JobsPage } from "./features/job/pages/JobsPage";
import { FreelancersPage } from "./features/freelancer/pages/FreelancerPage";
import { FreelancerDashboard } from "./features/freelancer/pages/FreelancerDashboard";
import { ClientDashboard } from "./features/user/pages/ClientDashboard";
import "./App.css";

function App() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  const closeAllModals = () => {
    setIsLoginOpen(false);
    setIsRegisterOpen(false);
  };

  return (
    <div className="app-wrapper">
      <NavBar
        onLoginClick={() => {
          closeAllModals();
          setIsLoginOpen(true);
        }}
        onRegisterClick={() => {
          closeAllModals();
          setIsRegisterOpen(true);
        }}
      />

      {isLoginOpen && <LoginPage onClose={() => setIsLoginOpen(false)} />}

      {isRegisterOpen && (
        <RegisterPage onClose={() => setIsRegisterOpen(false)} />
      )}

      <main className="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/jobs" element={<JobsPage />} />
          <Route path="/freelancers" element={<FreelancersPage />} />
          <Route
            path="/freelancer-dashboard"
            element={<FreelancerDashboard />}
          />
          <Route path="/client-dashboard" element={<ClientDashboard />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
