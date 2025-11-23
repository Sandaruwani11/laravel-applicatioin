import React from 'react';
import { createRoot } from 'react-dom/client';
import MembersList from './components/MembersList';

const App = () => (
  <div className="container p-4">
    <h1>Accura Members</h1>
    <MembersList />
  </div>
);

createRoot(document.getElementById('app')).render(<App />);
