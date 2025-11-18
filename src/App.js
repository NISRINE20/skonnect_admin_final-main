import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import GlobalStyle from './styles/GlobalStyles.js';
import LoginPage from './pages/LoginPage';  
import Dashboard from './pages/Dashboard';
import Youths from './pages/Youths';
import Events from './pages/Events';
import Announcements from './pages/Announcements';
import Sample from './components/Sample';
import Calendar from './pages/Calendar';
import Comments from './pages/Comments';
import Analytics from './pages/Analytics.js';
import EventRecommender from './pages/EventRecommender.js';

function App() {
  return (
    <Router>
      <GlobalStyle />
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/youths" element={<Youths />} />
        <Route path="/events" element={<Events />} />
        <Route path="/announcements" element={<Announcements />} />
        <Route path="/sample" element={<Sample />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/comments" element={<Comments />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/event-recommender" element={<EventRecommender />} />

        {/* Add more routes here if needed */}
      </Routes>
    </Router>
  );
}

export default App;
