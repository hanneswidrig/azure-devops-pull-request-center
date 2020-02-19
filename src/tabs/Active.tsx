import * as React from 'react';

import { ITab } from './TabTypes';
import { ClassicTab } from './ClassicTab';

export const Active = (props: ITab) => <ClassicTab {...props} />;
