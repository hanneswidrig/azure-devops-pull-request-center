import { FetchAction } from '../state/actions';
import { ActionTypes, PrHubState } from '../state/types';

export type Enum<T extends object> = T[keyof T];

type ReducerAction = [Enum<typeof ActionTypes>, () => PrHubState];
export type SplitReducer = (state: PrHubState, action: FetchAction) => ReducerAction[];
