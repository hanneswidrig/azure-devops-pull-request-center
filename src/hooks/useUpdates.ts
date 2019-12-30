import { useState, useEffect } from 'react';
import { useLocalStorage } from '@rehooks/local-storage';

import { TabOptions, PR } from '../state/types';
import { useTypedSelector } from '../lib/utils';

export const useUpdates = (selectedTab: TabOptions) => {
  const pullRequests = useTypedSelector(store => store.data.pullRequests);
  const [local, setLocal] = useLocalStorage<Record<TabOptions, number[]> | undefined>('prc-history-pull-requests');
  const [state, setState] = useState<Record<TabOptions, number[]>>(local ?? defaultState);

  useEffect(() => {
    const newState = getStateOrganized(pullRequests);
    if (!statesAreEqual(newState, state) && pullRequests.length > 0) {
      setState(newState);
      setLocal(newState);
    }

    if (pullRequests.length === 0) {
      setState(defaultState);
      setLocal(defaultState);
    }
  }, [state, pullRequests, setLocal]);
};

const defaultState: Record<TabOptions, number[]> = {
  active: [],
  draft: [],
  recentlyCompleted: [],
};

const statesAreEqual = (prev: Record<TabOptions, number[]>, next: Record<TabOptions, number[]>) => {
  return (
    JSON.stringify(prev.active.sort()) === JSON.stringify(next.active.sort()) &&
    JSON.stringify(prev.draft.sort()) === JSON.stringify(next.draft.sort()) &&
    JSON.stringify(prev.recentlyCompleted.sort()) === JSON.stringify(next.recentlyCompleted.sort())
  );
};

const getStateOrganized: (pullRequests: PR[]) => Record<TabOptions, number[]> = pullRequests => {
  return {
    active: pullRequests.filter(pr => pr.isActive && !pr.isDraft).map(pr => pr.pullRequestId),
    draft: pullRequests.filter(pr => pr.isDraft).map(pr => pr.pullRequestId),
    recentlyCompleted: pullRequests.filter(pr => pr.isCompleted).map(pr => pr.pullRequestId),
  };
};
