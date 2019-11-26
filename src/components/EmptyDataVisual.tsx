import React from 'react';

import './EmptyDataVisual.scss';
import Void from './resources/empty.png';

export const EmptyDataVisual = () => {
  return (
    <div className="empty-data-container">
      <div className="empty-data-img-wrapper">
        <img className="empty-data-img" src={Void} alt="no pull requests found." />
      </div>
      <div className="empty-data-text">
        <p>No Pull Requests available for this view.</p>
      </div>
    </div>
  );
};
