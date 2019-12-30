import { useState, useEffect } from 'react';
import { useLocalStorage } from '@rehooks/local-storage';

import { TabOptions, PR } from '../state/types';
import { useTypedSelector } from '../lib/utils';

type State = Record<TabOptions, number[]>;

export const useUpdates = () => {
  const pullRequests = useTypedSelector(store => store.data.pullRequests);
  const [local, setLocal] = useLocalStorage<State | undefined>('prc-history-pull-requests');
  const [state, setState] = useState<State>(local ?? defaultState);
  const [diffs, setDiffs] = useState<State>(defaultState);

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

const defaultState: State = {
  active: [],
  draft: [],
  completed: [],
};

const statesAreEqual = (prev: State, next: State) => {
  return (
    JSON.stringify(prev.active.sort()) === JSON.stringify(next.active.sort()) &&
    JSON.stringify(prev.draft.sort()) === JSON.stringify(next.draft.sort()) &&
    JSON.stringify(prev.completed.sort()) === JSON.stringify(next.completed.sort())
  );
};

const getStateOrganized: (pullRequests: PR[]) => State = pullRequests => {
  return {
    active: pullRequests.filter(pr => pr.isActive && !pr.isDraft).map(pr => pr.pullRequestId),
    draft: pullRequests.filter(pr => pr.isDraft).map(pr => pr.pullRequestId),
    completed: pullRequests.filter(pr => pr.isCompleted).map(pr => pr.pullRequestId),
  };
};
