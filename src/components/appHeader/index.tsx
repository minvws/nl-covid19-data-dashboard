import React from 'react';
import './style.scss';

const AppHeader: React.FC = () => {
  return (
    <div className="appHeader">
      <nav>
        <a href="#" className="navButton active">
          Landelijke cijfers
        </a>
        <a href="#" className="navButton">
          Regio cijfers
        </a>
        <a href="#" className="navButton">
          Over dit dashboard
        </a>
      </nav>
    </div>
  );
};

export default AppHeader;
