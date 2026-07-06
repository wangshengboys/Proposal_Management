import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import CompleteProfilePage from './pages/CompleteProfilePage';
import DashboardPage from './pages/DashboardPage';
import ProposalForm from './pages/ProposalForm';

function App() {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '380188207405-lv0jg4psp4gp99cqiu3c8e67uig38jej.apps.googleusercontent.com';

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<SignupPage />} />
          <Route path="/complete-profile" element={<CompleteProfilePage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/pengajuan-proposal" element={<ProposalForm />} />
        </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;