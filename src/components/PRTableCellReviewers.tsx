import React, { useState, useCallback } from 'react';
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
};

type ReviewerOverflowProps = { reviewers: IdentityRefWithVote[]; hiddenReviewers: Widths[] };
const ReviewerOverflow = ({ reviewers, hiddenReviewers }: ReviewerOverflowProps) => (
  <Tooltip
    className="tooltip-overflow"
    renderContent={() => (
      <div className="tooltip-overflow-container flex-column rhythm-horizontal-4">
        <div className="flex-row flex-center justify-center">
          <NoVote className="vote-status no-vote" />
          <span style={{ fontWeight: 'bold' }}>Reviewers</span>
        </div>
        <div className="flex-column flex-center justify-start">
          {hiddenReviewers.map((v) => reviewerPill(reviewers[v.index]))}
        </div>
      </div>
    )}>
    <div className="tooltip-overflow-child">
      <Pill variant={2} size={2}>
        <div style={{ height: '22px' }}>+{hiddenReviewers.length}</div>
      </Pill>
    </div>
  </Tooltip>
);

export const reviewerPill = (reviewer: IdentityRefWithVote) => (
  <Tooltip
    key={reviewer.id}
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
    )}>
    <div className="tooltip-overflow-child">
      <Pill key={reviewer.id} variant={2} color={reviewerVoteToIColorLight(reviewer.vote)} size={2}>
        <div className="flex-row rhythm-horizontal-8">
          {getReviewerVoteIconStatus(reviewer.vote)}
          <span>{reviewer.displayName}</span>
        </div>
      </Pill>
    </div>
  </Tooltip>
);

type Props = { reviewers: IdentityRefWithVote[] };
export const PRTableCellReviewers = ({ reviewers }: Props) => {
  const [widths, setWidths] = useState<Widths[]>([]);

  const measureTag = useCallback(
    (node: HTMLDivElement | null) =>
      node &&
      setWidths((widths) => {
        const elementWidth = Math.ceil(node.getBoundingClientRect().width) ?? 0;
        const totalWidth = [...widths.map((w) => w.width), elementWidth].reduce((prev, curr) => prev + curr, 0);

        return [
          ...widths,
          {
            index: widths.length,
            width: elementWidth,
            totalWidth: totalWidth,
            isOverflow: totalWidth > 600,
          },
        ];
      }),
    []
  );

  const showPillGroup = widths.length > 0 && widths.length === reviewers.length;
  if (showPillGroup) {
    return (
      <div className="reviewers-container">
        <PillGroup overflow={1}>
          {widths.filter((w) => !w.isOverflow).map((v) => reviewerPill(reviewers[v.index]))}
          {widths.filter((w) => w.isOverflow).length > 0 && (
            <ReviewerOverflow reviewers={reviewers} hiddenReviewers={widths.filter((w) => w.isOverflow)} />
          )}
        </PillGroup>
      </div>
    );
  }

  return (
    <div className="reviewers-container">
      <PillGroup overflow={1}>
        {reviewers.map((reviewer) => (
          <div key={reviewer.id} ref={measureTag} className="tooltip-overflow-child">
            <Pill variant={2} color={reviewerVoteToIColorLight(reviewer.vote)} size={2}>
              <div className="flex-row rhythm-horizontal-8">
                {getReviewerVoteIconStatus(reviewer.vote)}
                <span>{reviewer.displayName}</span>
              </div>
            </Pill>
          </div>
        ))}
      </PillGroup>
    </div>
  );
};
