import React, { useState, useCallback, useEffect } from 'react';
import { IdentityRefWithVote } from 'azure-devops-extension-api/Git/Git';
import { reviewerPill } from './PRTableCellReviewers';
import { PillGroup } from 'azure-devops-ui/PillGroup';
import { Tooltip } from 'azure-devops-ui/TooltipEx';
import { Pill } from 'azure-devops-ui/Pill';

const OVERFLOW_WIDTH = 600;

type Widths = {
  index: number;
  width: number;
  totalWidth: number;
  isOverflow: boolean;
  tagElement: React.ReactElement;
};

const ReviewerOverflow: React.FC<{ hiddenElements: Widths[] }> = ({ hiddenElements }: { hiddenElements: Widths[] }) => (
  <Tooltip
    className="tooltip-overflow"
    renderContent={() => (
      <div className="tooltip-overflow-parent">
        {hiddenElements.length > 0 && hiddenElements.map(ve => ve.tagElement)}
      </div>
    )}
  >
    <Pill key={`overflow-pill`} variant={2} size={1}>
      <span style={{ fontWeight: 'bold' }}>+{hiddenElements.length}</span>
    </Pill>
  </Tooltip>
);

type Props = { reviewers: IdentityRefWithVote[] };
export const ReviewersGroup: React.FC<Props> = ({ reviewers }: Props) => {
  const [widths, setWidths] = useState<Widths[]>([]);
  const [visibleElements, setVisibleElements] = useState<Widths[]>([]);
  const [hiddenElements, setHiddenElements] = useState<Widths[]>([]);

  const measureTag = useCallback(
    (node: any) =>
      setWidths(widths => {
        if (node !== null) {
          const index = widths.length;
          const elementWidth = Math.ceil(node?.getBoundingClientRect().width) ?? 0;
          const totalWidth = [...widths.map(w => w.width), elementWidth].reduce((prev, curr) => prev + curr, 0);
          return [
            ...widths,
            {
              index: index,
              width: elementWidth,
              totalWidth: totalWidth,
              isOverflow: totalWidth > OVERFLOW_WIDTH,
              tagElement: reviewerPill(reviewers[index], index),
            },
          ];
        }

        return widths;
      }),
    [reviewers],
  );

  useEffect(() => {
    if (widths.length > 0) {
      setVisibleElements(widths.filter(w => !w.isOverflow));
      setHiddenElements(widths.filter(w => w.isOverflow));
    }
  }, [widths]);

  return (
    <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
      <div style={{ position: 'absolute', opacity: 0 }}>{reviewers.map((r, i) => reviewerPill(r, i, measureTag))}</div>
      <PillGroup overflow={1}>
        {visibleElements.length > 0 && visibleElements.map(ve => ve.tagElement)}
        <ReviewerOverflow hiddenElements={hiddenElements} />
      </PillGroup>
    </div>
  );
};
