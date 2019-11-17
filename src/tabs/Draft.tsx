import * as React from 'react';

import { ITab } from './TabTypes';
import { ClassicTab } from './ClassicTab';

export const Draft: React.FC<ITab> = props => <ClassicTab {...props} />;
