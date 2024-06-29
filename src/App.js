import React from 'react';
import {  Routes, Route } from 'react-router-dom';
import Navbar from './components/Layout/Navbar';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import QuizList from './components/Quiz/QuizList';
import Quiz from './components/Quiz/Quiz';
import Result from './components/Quiz/Result';
import PrivateRoute from './components/Layout/PrivateRoute';
import { AuthProvider } from './context/AuthContext';
import QuizHistory from './components/Quiz/QuizHistory';

const App = () => {
  return (
    <AuthProvider>
     
        <Navbar />
        <div className="container mt-4">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<PrivateRoute><QuizList /></PrivateRoute>} />
            <Route path="/quiz/:id" element={<PrivateRoute><Quiz /></PrivateRoute>} />
            <Route path="/quiz/history" element={<PrivateRoute><QuizHistory /></PrivateRoute>} />
            <Route path="/quiz/result/:resultId" element={<PrivateRoute><Result /></PrivateRoute>} />
          </Routes>
        </div>
     
    </AuthProvider>
  );
};

export default App;
