import React  from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import './css/App.css';
import Routes from './Routes'; 

const App: React.FC = () => {  

  return (
    <Router>
      <div className='main-app-container'>
        <Routes />
      </div>
    </Router>
  );
};

export default App;