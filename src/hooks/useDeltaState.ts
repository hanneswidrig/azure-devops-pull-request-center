import { useState, useEffect } from 'react';
import { useLocalStorage } from '@rehooks/local-storage';

import { TabOptions, PR } from '../state/types';
import { useTypedSelector } from '../lib/utils';

type State = Record<TabOptions, number[]>;
type Items = { added: number[]; moved: number[] };
type Delta = { items: Items; count: number; isEqual: boolean };
type DeltaState = Record<TabOptions, Delta>;
type DeltaStateWrapper = { deltaState: DeltaState; areEqual: boolean };
type StateDifferences = (prevState: State, nextState: State) => DeltaStateWrapper;
type DeltaStateMerge = (prevDeltaState: DeltaState, nextDeltaState: DeltaState) => DeltaState;

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
      items: {
        added: [],
        moved: [],
      },
    },
    completed: {
      count: 0,
      isEqual: true,
      items: {
        added: [],
        moved: [],
      },
    },
    draft: {
      count: 0,
      isEqual: true,
      items: {
        added: [],
        moved: [],
      },
    },
  },
  areEqual: true,
};

export const useDeltaUpdate = () => {
  const pullRequests = useTypedSelector(store => store.data.pullRequests);
  const asyncTaskCount = useTypedSelector(store => store.data.asyncTaskCount);
  const [local, setLocal] = useLocalStorage<State>('cHJjLWxhc3QtcHVsbC1yZXF1ZXN0');
  const [state, setState] = useState<State>(local ?? defaultState);
  const [delta, setDelta] = useState<DeltaStateWrapper>(defaultDeltaState);
  const [localDelta, setLocalDelta] = useLocalStorage<DeltaState>('cHJjLWxhc3QtYWNrbm93bGVkZ2Vk');

  useEffect(() => {
    const newState = getStateOrganized(pullRequests);
    const deltaState = getDeltaState(newState, state);
    const changesRequired = asyncTaskCount === 0 && !deltaState.areEqual;
    if (pullRequests.length > 0 && changesRequired) {
      setLocal(newState);
      setState(newState);
      setDelta(local !== undefined ? deltaState : defaultDeltaState);
      setLocalDelta(mergeDeltaStates(localDelta ?? defaultDeltaState.deltaState, deltaState.deltaState));
    }
  }, [asyncTaskCount, local, pullRequests, setLocal, setLocalDelta, localDelta, state]);

  useEffect(() => {
    console.group(`🔎`);
    console.log('delta', delta);
    console.log('localDelta', localDelta);
    console.groupEnd();
  }, [delta, localDelta]);

  return {
    deltaUpdate: delta,
    acknowledge: () => {
      setDelta(defaultDeltaState);
      setLocalDelta(defaultDeltaState.deltaState);
    },
  };
};

const xor = (val: number, prev: number[], next: number[]): boolean => !prev.includes(val) || !next.includes(val);
const addedOr = (val: number, prev: number[], next: number[]): boolean => !(!prev.includes(val) && next.includes(val));
const movedOr = (val: number, prev: number[], next: number[]): boolean => !(prev.includes(val) && !next.includes(val));

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
      items: {
        added: mergedNextState.active.filter(val => addedOr(val, prevState.active, nextState.active)),
        moved: mergedNextState.active.filter(val => movedOr(val, prevState.active, nextState.active)),
      },
      count: mergedNextState.active.length,
      isEqual: mergedNextState.active.length === 0,
    },
    completed: {
      items: {
        added: mergedNextState.completed.filter(val => addedOr(val, prevState.completed, nextState.completed)),
        moved: mergedNextState.completed.filter(val => movedOr(val, prevState.completed, nextState.completed)),
      },
      count: mergedNextState.completed.length,
      isEqual: mergedNextState.completed.length === 0,
    },
    draft: {
      items: {
        added: mergedNextState.draft.filter(val => addedOr(val, prevState.draft, nextState.draft)),
        moved: mergedNextState.draft.filter(val => movedOr(val, prevState.draft, nextState.draft)),
      },
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

const mergeDeltaStates: DeltaStateMerge = (prevDelta, nextDelta) => {
  return {
    active: {
      count: getCount(prevDelta.active, nextDelta.active),
      isEqual: getIsEqual(prevDelta.active, nextDelta.active),
      items: getItems(prevDelta.active.items, nextDelta.active.items),
    },
    completed: {
      count: getCount(prevDelta.completed, nextDelta.completed),
      isEqual: getIsEqual(prevDelta.completed, nextDelta.completed),
      items: getItems(prevDelta.completed.items, nextDelta.completed.items),
    },
    draft: {
      count: getCount(prevDelta.draft, nextDelta.draft),
      isEqual: getIsEqual(prevDelta.draft, nextDelta.draft),
      items: getItems(prevDelta.draft.items, nextDelta.draft.items),
    },
  };
};

const getCount: (prevDelta: Delta, nextDelta: Delta) => number = (prevDelta, nextDelta) => {
  return prevDelta.count + nextDelta.count;
};

const getIsEqual: (prevDelta: Delta, nextDelta: Delta) => boolean = (prevDelta, nextDelta) => {
  return prevDelta.isEqual && nextDelta.isEqual;
};

const getItems: (prevItems: Items, nextItems: Items) => Items = (prevItems, nextItems) => {
  return {
    added: [...prevItems.added, ...nextItems.added],
    moved: [...prevItems.moved, ...nextItems.moved],
  };
};

/**
 * Debugging collection for handling restore/save correctly
 */
// console.group(`🛢 state will be modified`);
// console.groupCollapsed(`🏞`);
// console.log('asyncTaskCount', asyncTaskCount);
// console.log('pullRequests', pullRequests);
// console.log('local', local);
// console.log('state', state);
// console.groupEnd();
// console.group(`⚙`);
// console.log('newState', newState);
// console.log('deltaState', local !== undefined ? deltaState : defaultDeltaState);
// console.log('changesRequired', changesRequired);
// console.groupEnd();
// console.groupEnd();
