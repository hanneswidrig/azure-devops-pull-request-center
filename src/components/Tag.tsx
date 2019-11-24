import React from 'react';

import './Tag.scss';
import { Colors } from '../lib/colors';

type Props = { title: string; type: 'draft' | 'autoComplete' | 'mergeConflict' };
export const Tag: React.FC<Props> = ({ title, type }: Props) => {
  const typeColor: string = {
    draft: Colors.blue.primary,
    autoComplete: Colors.orange.primary,
    mergeConflict: Colors.red.primary,
  }[type];
  return (
    <span className="tag-container" style={{ color: typeColor, border: `1px solid ${typeColor}` }}>
      <span className="tag-text">{title}</span>
    </span>
  );
};
