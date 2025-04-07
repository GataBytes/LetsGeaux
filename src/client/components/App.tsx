import React, { useState, useEffect } from 'react';
import {
  Routes,
  Route,
  BrowserRouter as Router,
  useParams,
  useNavigate,
  Navigate,
  useLocation,
  Link
} from 'react-router-dom';
import axios from 'axios';

// feature routes
import Home from './Home.tsx';
import Login from './Login.tsx';
import Maps from './Maps.tsx';
import Suggestions from './Suggestions.tsx';
import ChatBot from './Chat/ChatBot.tsx';
import Itinerary from './Itineraray.tsx';
import BudgetBuddy from './BudgetBuddy/BudgetBuddy.tsx';
import Activities from './NEWActivties.tsx';
import ActivitiesChoices from './RouteChoices';
import Logout from './Logout.tsx';
import Calendar from './Calendar.tsx';
import RouteChoices from './RouteChoices.tsx'
import Wishlist from './Wishlist.tsx';
import { user } from '../../../types/models.ts';
//import Activity from './NEWActivties.tsx';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<user | null>(null);
  // Check Auth
  useEffect(() => {
<<<<<<< HEAD
    const checkAuth = async () => { //? type
=======
    const checkAuth = async () => {
      //? type
>>>>>>> 640e0b53e4b3a2f35f26de2db6d15f53a1b2d061
      try {
        const response = await axios.get('/api/check-auth');
        setIsAuthenticated(response.data.isAuthenticated);

        if (response.data.isAuthenticated) {
          const fetchedUser: user = response.data.user;
          setUser(fetchedUser);
          localStorage.removeItem('sessionId');
        }
      } catch (error) {
        setIsAuthenticated(false);
        console.error('Server: Err checking auth status', error);
      }
    };
    checkAuth();
  }, []);
<<<<<<< HEAD

  // Protected Route
  const ProtectedRoute: React.FC<{children: React.ReactNode}> = ({children}) => {
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }
    return <>{children}</>
  };
=======
>>>>>>> 640e0b53e4b3a2f35f26de2db6d15f53a1b2d061

  // Protected Route
  const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
    children
  }) => {
    if (!isAuthenticated) {
      return <Navigate to='/login' replace />;
    }
    return <>{children}</>;
  };

  return (
    <Routes>

      <Route path="/login" element={!isAuthenticated ? <Login /> :  <Navigate to="/" replace />} />

      <Route path="/" element={
        <ProtectedRoute>
         {user && <Home user = {user}/> }
        </ProtectedRoute>
      }/>
      <Route path="/maps" element={
        <ProtectedRoute>
          <Maps/>
        </ProtectedRoute>
      }/>
      <Route path="/suggestions" element={
        <ProtectedRoute>
          {user && <Suggestions user = {user} />}
        </ProtectedRoute>
      }/>
      <Route path="/wishlist" element={
        <ProtectedRoute>
          {user && <Wishlist user = {user} />}
        </ProtectedRoute>
      }/>
      <Route path="/chatbot" element={
        <ProtectedRoute>
          { user && <ChatBot user = {user} />}
        </ProtectedRoute>
      }/>
      <Route path="/itinerary" element={
        <ProtectedRoute>
          {user && <Itinerary user = {user}/>}
        </ProtectedRoute>
      }/>

      <Route path="/budgetbuddy" element={
        <ProtectedRoute>
          <BudgetBuddy />
        </ProtectedRoute>
      }/>
      <Route path='/routechoices' element={
        <ProtectedRoute>
          <RouteChoices/>
        </ProtectedRoute>
      }/>

<Route path='/activities' element={
        <ProtectedRoute>
          <Activities/>
        </ProtectedRoute>
      }/>

      <Route path="/logout" element={
        <ProtectedRoute>
        <Logout />
      </ProtectedRoute>
      } />
    </Routes>
  );
};

export default App;
