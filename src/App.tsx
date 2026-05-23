import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { NavBar } from "./features/user/components/Navbar";
import { HomePage } from "./features/HomePage";
import { LoginPage } from "./features/user/pages/LoginPage";
import { RegisterPage } from "./features/user/pages/RegisterPage";
import { JobsPage } from "./features/job/pages/JobsPage";
import { FreelancersPage } from "./features/freelancer/pages/FreelancerPage";
import { FreelancerLayout } from "./features/freelancer/pages/FreelancerLayout";
import { ProfilePage } from "./features/freelancer/pages/ProfilePage";
import { OptimizationPage } from "./features/freelancer/pages/OptimizationPage";
import { ClientJobs } from "./features/user/pages/ClientJobs";
import { ClientLayout } from "./features/user/pages/ClientLayout";
import { ClientProfile } from "./features/user/pages/ClientProfile";
import { BecomeFreelancer } from "./features/freelancer/pages/BecomeFreelancer";
import { MyProposals } from "./features/proposal/pages/myProposals";
import { FreelancerJobsPage } from "./features/freelancer/pages/FreelancerJobsPage";
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

      <main className="app-main">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/jobs" element={<JobsPage />} />
          <Route path="/freelancers" element={<FreelancersPage />} />
          <Route path="/become-a-seller" element={<BecomeFreelancer />} />

          <Route path="/freelancer-dashboard" element={<FreelancerLayout />}>
            <Route index element={<Navigate to="profile" replace />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="matching" element={<OptimizationPage />} />
            <Route path="my-proposals" element={<MyProposals />} />
            <Route path="freelancer-jobs" element={<FreelancerJobsPage />} />
          </Route>

          <Route path="/client-dashboard" element={<ClientLayout />}>
            <Route index element={<Navigate to="client-profile" replace />} />
            <Route path="client-profile" element={<ClientProfile />} />
            <Route path="client-jobs" element={<ClientJobs />} />
          </Route>
        </Routes>
      </main>
    </div>
  );
}

export default App;
