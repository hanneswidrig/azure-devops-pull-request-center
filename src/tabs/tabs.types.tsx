import { Filter } from 'azure-devops-ui/Utilities/Filter';
import { IReadonlyObservableValue } from 'azure-devops-ui/Core/Observable';

import { PR } from '../state/types';

export interface ITab {
  filter: Filter;
}

const active = 'active';
const draft = 'draft';
const tabOptions = [active, draft] as const;

export const TabOptions = { active: active, draft: draft } as const;
export type TabOptionsType = typeof tabOptions[number];
export type ActiveItemProvider = PR | IReadonlyObservableValue<PR | undefined>;
