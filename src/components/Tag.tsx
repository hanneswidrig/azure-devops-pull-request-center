import React from 'react';

import './Tag.scss';
import { Colors } from '../lib/colors';

interface TagProps {
  title: string;
  type: 'draft' | 'autoComplete';
}
export const Tag: React.FC<TagProps> = ({ title, type }: TagProps) => {
  const typeColor: string = { draft: Colors.blue.primary, autoComplete: Colors.orange.primary }[type];
  return (
    <span className='tag-container' style={{ color: typeColor, border: `1px solid ${typeColor}` }}>
      <span className='tag-text'>{title}</span>
    </span>
  );
};
