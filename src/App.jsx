import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';



import Navbar from './components/Navbar';

import Register from './Pages/Register';
import ProtectedRoute from './components/protectedRoute';
import PostForm from './components/Posts/PostForm';
import Home from './Pages/Home';
import Posts from './Pages/Posts';
import Login from './Pages/Login';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/"
            element={
              <protectedRoute>
                <Home />
              </protectedRoute>
            }
          />
          <Route
            path="/posts"
            element={
              <ProtectedRoute>
                <Posts />
              
              </ProtectedRoute>
            }
          />
        </Routes>
        
      </AuthProvider>
    </Router>
  );
}

export default App;