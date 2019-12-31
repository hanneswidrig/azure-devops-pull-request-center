import { useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';

import { RefreshDuration } from '../state/types';
import { setPullRequests } from '../state/actions';

export const useRefreshTicker = (refreshDuration: RefreshDuration) => {
  const dispatch = useDispatch();
  const [ticker, setTicker] = useState(refreshDuration !== 'off' ? Number(refreshDuration) : -1);

  useEffect(() => {
    if (refreshDuration !== 'off') {
      setTicker(Number(refreshDuration));
      const interval = setInterval(() => setTicker(secsLeft => (secsLeft === 1 ? 0 : secsLeft - 1)), 1000);
      return () => clearInterval(interval);
    }
  }, [refreshDuration]);

  useEffect(() => {
    if (ticker === 0) {
      setTicker(Number(refreshDuration));
      dispatch(setPullRequests());
    }
  }, [ticker, refreshDuration, dispatch]);

  return { timeUntil: refreshDuration !== 'off' ? relativeFormatter(ticker) : '' };
};

const relativeFormatter = (timeUntil: number) => {
  const minutesLeft = Math.floor(timeUntil / 60);
  const secondsLeft = timeUntil % 60;
  const modSeconds = secondsLeft % 60;
  const addZeroLeft = modSeconds > 0 && modSeconds < 10 ? '0' : '';
  const addZeroRight = modSeconds === 0 ? '0' : '';
  return `${minutesLeft}:${addZeroLeft}${secondsLeft}${addZeroRight}`;
};
