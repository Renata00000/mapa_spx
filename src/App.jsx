// App.jsx
// Cole isso no seu arquivo App.jsx principal

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import OpLogistica from './components/OpLogistica';
import AdminPanel from './components/AdminPanel';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<OpLogistica />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;