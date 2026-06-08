import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';

function App() {
  return (
    <Router>
      <Routes>
        {/* Jika user mengakses root '/', otomatis diarahkan (redirect) ke /login */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* Jalur Halaman Login */}
        <Route path="/login" element={<LoginPage />} />
        
        {/* Jalur Halaman Sign Up */}
        <Route path="/register" element={<SignupPage />} />
      </Routes>
    </Router>
  );
}

export default App;