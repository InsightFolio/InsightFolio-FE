import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard/Dashboard';
import SignUpPage from './pages/SignUp/SignUpPage';


const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  </BrowserRouter>
);


export default App;
