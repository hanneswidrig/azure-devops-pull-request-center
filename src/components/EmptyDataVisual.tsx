import React from 'react';

import './EmptyDataVisual.scss';

export const EmptyDataVisual = () => {
  return (
    <div className="empty-data-container">
      <div className="empty-data-text">
        <p>No Pull Requests available for this view.</p>
      </div>
    </div>
  );
};
