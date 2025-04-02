import React, { useState, useEffect } from 'react';
import { 
  Routes,
  Route,
  BrowserRouter as Router,
  useParams,
  useNavigate,
  Navigate,
  useLocation,
  Link  } from 'react-router-dom';
import axios from 'axios';


// feature routes
import Home from './Home.tsx';
import Login from './Login.tsx';
import Maps from './Maps.tsx'
//import Suggestions from './Suggestions.tsx'
import ChatBot from './ChatBot.tsx'
import Itinerary from './Itineraray.tsx';
import BudgetBuddy from './BudgetBuddy/BudgetBuddy.tsx';
//import Activities from './Activities.tsx';
//import ActivitiesChoices from './ActivityChoices';
import Calendar from './Calendar.tsx';

// interface ISetAuth {
  //   setAuth:
  // }

  // const Login = ({ setAuth }: ISetAuth) => {

  // }

  // States


  const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  // Check Auth
  useEffect(() => {
    const checkAuth = async () => { //? type 
      try {
        const response = await axios.get('/api/check-auth');
        setIsAuthenticated(response.data.isAuthenticated);

        if (response.data.isAuthenticated) {
          console.log(response.data.user);
        }
      }
      catch (error) {
        setIsAuthenticated(false);
        console.error('Server: Err checking auth status', error);
      }
    };
    checkAuth(); 
  }, []); 
  
  // Protected Route
  const ProtectedRoute: React.FC<{children: React.ReactNode}> = ({children}) => {
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }
    return <>{children}</>
  };


  return (
    <Routes>

      <Route path="/login" element={!isAuthenticated ? <Login /> :  <Navigate to="/" replace />} /> 
      
      <Route path="/" element={ 
        <ProtectedRoute>
          <Home /> 
        </ProtectedRoute>
      }/>
      <Route path="/maps" element={
        <ProtectedRoute>
          <Maps/>
        </ProtectedRoute>
      }/>
      {/* <Route path="/suggestions" element={
        <ProtectedRoute>
          <Suggestions/>
        </ProtectedRoute>
      }/> */}
      <Route path="/chatbot" element={
        <ProtectedRoute>
          <ChatBot/>
        </ProtectedRoute>
      }/>
      <Route path="/itinerary" element={
        <ProtectedRoute>
          <Itinerary/>
        </ProtectedRoute>
      }/>
      <Route path="/calendar" element={
        <ProtectedRoute>
          <Calendar/>
        </ProtectedRoute> 
      }/>
      <Route path="/budgetbuddy" element={
        <ProtectedRoute> 
          <BudgetBuddy />
        </ProtectedRoute>
      }/>
    </Routes>
  )
};

export default App;
