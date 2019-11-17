import React from 'react';
import './StatusIcon.scss';

export const Approved: React.FC<{ className: string }> = ({ className }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" className={className}>
    <path d="M12 2C6.5 2 2 6.5 2 12S6.5 22 12 22 22 17.5 22 12 17.5 2 12 2M10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z" />
  </svg>
);

export const ApprovedWithSuggestions: React.FC<{ className: string }> = ({ className }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" className={className}>
    <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M17,18H7V16H17V18M10.3,14L7,10.7L8.4,9.3L10.3,11.2L15.6,5.9L17,7.3L10.3,14Z" />
  </svg>
);

export const NoVote: React.FC<{ className: string }> = ({ className }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" className={className}>
    <path d="M12,2C6.47,2 2,6.5 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M15.6,8.34C16.67,8.34 17.53,9.2 17.53,10.27C17.53,11.34 16.67,12.2 15.6,12.2A1.93,1.93 0 0,1 13.67,10.27C13.66,9.2 14.53,8.34 15.6,8.34M9.6,6.76C10.9,6.76 11.96,7.82 11.96,9.12C11.96,10.42 10.9,11.5 9.6,11.5C8.3,11.5 7.24,10.42 7.24,9.12C7.24,7.81 8.29,6.76 9.6,6.76M9.6,15.89V19.64C7.2,18.89 5.3,17.04 4.46,14.68C5.5,13.56 8.13,13 9.6,13C10.13,13 10.8,13.07 11.5,13.21C9.86,14.08 9.6,15.23 9.6,15.89M12,20C11.72,20 11.46,20 11.2,19.96V15.89C11.2,14.47 14.14,13.76 15.6,13.76C16.67,13.76 18.5,14.15 19.44,14.91C18.27,17.88 15.38,20 12,20Z" />
  </svg>
);

export const WaitingOnAuthor: React.FC<{ className: string }> = ({ className }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" className={className}>
    <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M16.2,16.2L11,13V7H12.5V12.2L17,14.9L16.2,16.2Z" />
  </svg>
);

export const Rejected: React.FC<{ className: string }> = ({ className }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" className={className}>
    <path d="M12,2C17.53,2 22,6.47 22,12C22,17.53 17.53,22 12,22C6.47,22 2,17.53 2,12C2,6.47 6.47,2 12,2M15.59,7L12,10.59L8.41,7L7,8.41L10.59,12L7,15.59L8.41,17L12,13.41L15.59,17L17,15.59L13.41,12L17,8.41L15.59,7Z" />
  </svg>
);

export const getReviewerVoteIconStatus = (vote: string | number): JSX.Element => {
  const getIcon: Record<string, JSX.Element> = {
    '10': <Approved className="vote-status approved" />,
    '5': <ApprovedWithSuggestions className="vote-status approved-with-suggestions" />,
    '0': <NoVote className="vote-status no-vote" />,
    '-5': <WaitingOnAuthor className="vote-status waiting" />,
    '-10': <Rejected className="vote-status rejected" />,
  };
  return <div className="vote-status-container">{getIcon[vote]}</div>;
};
