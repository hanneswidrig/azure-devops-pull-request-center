import { useState, useEffect } from 'react';
import { useLocalStorage } from '@rehooks/local-storage';

import { TabOptions, PR } from '../state/types';
import { useTypedSelector } from '../lib/utils';

type State = Record<TabOptions, number[]>;
type DeltaState = Record<TabOptions, { items: number[]; count: number; isEqual: boolean }>;
type DeltaStateWrapper = { deltaState: DeltaState; areEqual: boolean };
type StateDifferences = (prevState: State, nextState: State) => DeltaStateWrapper;

const defaultState: State = {
  active: [],
  completed: [],
  draft: [],
};

const defaultDeltaState: DeltaStateWrapper = {
  deltaState: {
    active: {
      count: 0,
      isEqual: true,
      items: [],
    },
    completed: {
      count: 0,
      isEqual: true,
      items: [],
    },
    draft: {
      count: 0,
      isEqual: true,
      items: [],
    },
  },
  areEqual: true,
};

export const useUpdates = () => {
  const pullRequests = useTypedSelector(store => store.data.pullRequests);
  const asyncTaskCount = useTypedSelector(store => store.data.asyncTaskCount);
  const [local, setLocal] = useLocalStorage<State>('prc-history-pull-requests');
  const [state, setState] = useState<State>(local ?? defaultState);
  const [delta, setDelta] = useState<DeltaStateWrapper>(defaultDeltaState);

  useEffect(() => {
    const newState = getStateOrganized(pullRequests);
    const deltaState = getDeltaState(newState, state);
    const changesRequired = asyncTaskCount === 0 && !deltaState.areEqual;
    if (pullRequests.length > 0 && changesRequired) {
      setState(pullRequests.length > 0 ? newState : defaultState);
      setLocal(pullRequests.length > 0 ? newState : defaultState);
      setDelta(deltaState);
    }
  }, [state, pullRequests, asyncTaskCount, setLocal]);

  return { deltaUpdate: delta };
};

const xor = (val: number, prev: number[], next: number[]): boolean => !prev.includes(val) || !next.includes(val);

const getDeltaState: StateDifferences = (prevState, nextState) => {
  const mergedActive = [...prevState.active, ...nextState.active];
  const mergedDraft = [...prevState.draft, ...nextState.draft];
  const mergedCompleted = [...prevState.completed, ...nextState.completed];
  const mergedNextState: State = {
    active: mergedActive.filter(val => xor(val, prevState.active, nextState.active)),
    completed: mergedCompleted.filter(val => xor(val, prevState.completed, nextState.completed)),
    draft: mergedDraft.filter(val => xor(val, prevState.draft, nextState.draft)),
  };
  const difference: DeltaState = {
    active: {
      items: mergedNextState.active,
      count: mergedNextState.active.length,
      isEqual: mergedNextState.active.length === 0,
    },
    completed: {
      items: mergedNextState.completed,
      count: mergedNextState.completed.length,
      isEqual: mergedNextState.completed.length === 0,
    },
    draft: {
      items: mergedNextState.draft,
      count: mergedNextState.draft.length,
      isEqual: mergedNextState.draft.length === 0,
    },
  };
  return {
    deltaState: difference,
    areEqual: difference.active.isEqual && difference.draft.isEqual && difference.completed.isEqual,
  };
};

const getStateOrganized: (pullRequests: PR[]) => State = pullRequests => {
  return {
    active: pullRequests.filter(pr => pr.isActive && !pr.isDraft).map(pr => pr.pullRequestId),
    completed: pullRequests.filter(pr => pr.isCompleted).map(pr => pr.pullRequestId),
    draft: pullRequests.filter(pr => pr.isDraft).map(pr => pr.pullRequestId),
  };
};
