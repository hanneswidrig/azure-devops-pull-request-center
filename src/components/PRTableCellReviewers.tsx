import React, { useState, useCallback, useEffect } from 'react';
import { IdentityRefWithVote } from 'azure-devops-extension-api/Git/Git';

import { Pill } from 'azure-devops-ui/Pill';
import { Tooltip } from 'azure-devops-ui/TooltipEx';
import { PillGroup } from 'azure-devops-ui/PillGroup';
import { VssPersona } from 'azure-devops-ui/VssPersona';

import './PRTableCellReviewers.scss';
import { getVoteDescription } from '../lib/utils';
import { reviewerVoteToIColorLight } from '../lib/colors';
import { getReviewerVoteIconStatus, NoVote } from './StatusIcon';

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
      <div className="tooltip-overflow-container flex-column rhythm-horizontal-4">
        <div className="flex-row flex-center justify-center">
          <NoVote className="vote-status no-vote" />
          <span style={{ fontWeight: 'bold' }}>Reviewers</span>
        </div>
        <div className="flex-column flex-center justify-start">
          {hiddenElements.length > 0 && hiddenElements.map(ve => ve.tagElement)}
        </div>
      </div>
    )}
  >
    <div className="tooltip-overflow-child">
      <Pill variant={2} size={1}>
        <span style={{ fontWeight: 'bold' }}>+{hiddenElements.length}</span>
      </Pill>
    </div>
  </Tooltip>
);

export const reviewerPill = (reviewer: IdentityRefWithVote, i: number, ref?: (node: HTMLDivElement | null) => void) => (
  <Tooltip
    key={i}
    renderContent={() => (
      <div className="flex-row rhythm-horizontal-4">
        <div className="flex-column">
          <div className="flex-row flex-center justify-center">
            <VssPersona
              className="icon-margin"
              imageUrl={reviewer._links['avatar'].href}
              size={'small'}
              displayName={reviewer.displayName}
            />
            <span>{reviewer.displayName}</span>
          </div>
          <div className="flex-row flex-center justify-start margin-top-8">
            {getReviewerVoteIconStatus(reviewer.vote)}
            <span className="font-weight-semibold margin-left-4">{getVoteDescription(reviewer.vote)}</span>
          </div>
        </div>
      </div>
    )}
  >
    <div ref={ref} className="tooltip-overflow-child">
      <Pill key={reviewer.id} variant={2} color={reviewerVoteToIColorLight(reviewer.vote)} size={1}>
        <div className="flex-row rhythm-horizontal-8">
          {getReviewerVoteIconStatus(reviewer.vote)}
          <span>{reviewer.displayName}</span>
        </div>
      </Pill>
    </div>
  </Tooltip>
);

type Props = { reviewers: IdentityRefWithVote[] };
export const PRTableCellReviewers: React.FC<Props> = ({ reviewers }: Props) => {
  const [widths, setWidths] = useState<Widths[]>([]);
  const [visibleElements, setVisibleElements] = useState<Widths[]>([]);
  const [hiddenElements, setHiddenElements] = useState<Widths[]>([]);

  const measureTag = useCallback(
    (node: HTMLDivElement | null) => {
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
              isOverflow: totalWidth > 600,
              tagElement: reviewerPill(reviewers[index], index),
            },
          ];
        }

        return widths;
      });
    },
    [reviewers],
  );

  useEffect(() => {
    if (widths.length > 0) {
      setVisibleElements(widths.filter(w => !w.isOverflow));
      setHiddenElements(widths.filter(w => w.isOverflow));
      setWidths([]);
    }
  }, [widths]);

  // useEffect(() => {
  //   setVisibleElements([]);
  //   setHiddenElements([]);
  // }, [reviewers]);

  return (
    <div className="reviewers-container">
      <div className="reviewers-container-hidden">{reviewers.map((r, i) => reviewerPill(r, i, measureTag))}</div>
      <PillGroup overflow={1}>
        {visibleElements.length > 0 && visibleElements.map(ve => ve.tagElement)}
        {hiddenElements.length > 0 && <ReviewerOverflow hiddenElements={hiddenElements} />}
      </PillGroup>
    </div>
  );
};
