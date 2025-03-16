import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import ADRDetection from './components/ADRDetection';
import './App.css'; // You can import global styles here if needed

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Home route */}
        <Route path="/" element={<Home />} />
        
        {/* ADRDetection route */}
        <Route path="/search" element={<ADRDetection />} />
      </Routes>
    </Router>
  );
};

export default App;
