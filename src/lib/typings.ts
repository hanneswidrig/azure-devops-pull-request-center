import { AnyAction, Action } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { ActionTypes, PrHubState } from '../state/types';

export type Enum<T extends Record<string, unknown>> = T[keyof T];

export type ReducerAction = [Enum<typeof ActionTypes>, () => PrHubState];
export type SplitReducer = (state: PrHubState, action: FetchAction) => ReducerAction[];

export type Task<Args = undefined, ReturnType = void> = (...args: Args[]) => ThunkAction<ReturnType, PrHubState, null, AnyAction>;
export type FetchAction = Action & { payload?: any };
