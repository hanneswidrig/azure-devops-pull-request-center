import * as React from 'react';

import { ITab } from './TabTypes';
import { ClassicTab } from './ClassicTab';

export const RecentlyCompleted: React.FC<ITab> = props => <ClassicTab {...props} />;
