import * as React from 'react';

import { ITab } from './TabTypes';
import { ClassicTab } from './ClassicTab';

export const Draft = (props: ITab) => <ClassicTab {...props} />;
