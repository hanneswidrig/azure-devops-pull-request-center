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

const mockReviewers = [
  {
    reviewerUrl:
      'https://dev.azure.com/hanneswidrig/f2613275-db5d-4cbb-95c8-00ba53f76641/_apis/git/repositories/cd200cef-44c7-4839-8f93-57c6a0979eaa/pullRequests/1/reviewers/34e23bae-b50a-60e7-8258-075090a1841a',
    vote: 10,
    isFlagged: false,
    displayName: 'Hannes Widrig',
    url:
      'https://spsprodcus2.vssps.visualstudio.com/A3c1dfbfa-3808-4342-bb22-1929bc938ccd/_apis/Identities/34e23bae-b50a-60e7-8258-075090a1841a',
    _links: {
      avatar: {
        href:
          'https://dev.azure.com/hanneswidrig/_apis/GraphProfile/MemberAvatars/msa.MzRlMjNiYWUtYjUwYS03MGU3LTgyNTgtMDc1MDkwYTE4NDFh',
      },
    },
    id: '34e23bae-b50a-60e7-8258-075090a1841a',
    uniqueName: 'hannes_widrig@outlook.com',
    imageUrl: 'https://dev.azure.com/hanneswidrig/_api/_common/identityImage?id=34e23bae-b50a-60e7-8258-075090a1841a',
  },
  {
    reviewerUrl:
      'https://dev.azure.com/hanneswidrig/f2613275-db5d-4cbb-95c8-00ba53f76641/_apis/git/repositories/cd200cef-44c7-4839-8f93-57c6a0979eaa/pullRequests/1/reviewers/34e23bae-b50a-60e7-8258-075090a1841a',
    vote: 10,
    isFlagged: false,
    displayName: 'Hannes Widrig',
    url:
      'https://spsprodcus2.vssps.visualstudio.com/A3c1dfbfa-3808-4342-bb22-1929bc938ccd/_apis/Identities/34e23bae-b50a-60e7-8258-075090a1841a',
    _links: {
      avatar: {
        href:
          'https://dev.azure.com/hanneswidrig/_apis/GraphProfile/MemberAvatars/msa.MzRlMjNiYWUtYjUwYS03MGU3LTgyNTgtMDc1MDkwYTE4NDFh',
      },
    },
    id: '34e23bae-b50a-60e7-8258-075090a1841a',
    uniqueName: 'hannes_widrig@outlook.com',
    imageUrl: 'https://dev.azure.com/hanneswidrig/_api/_common/identityImage?id=34e23bae-b50a-60e7-8258-075090a1841a',
  },
  {
    reviewerUrl:
      'https://dev.azure.com/hanneswidrig/f2613275-db5d-4cbb-95c8-00ba53f76641/_apis/git/repositories/cd200cef-44c7-4839-8f93-57c6a0979eaa/pullRequests/1/reviewers/34e23bae-b50a-60e7-8258-075090a1841a',
    vote: 5,
    isFlagged: false,
    displayName: 'Hannes Widrig',
    url:
      'https://spsprodcus2.vssps.visualstudio.com/A3c1dfbfa-3808-4342-bb22-1929bc938ccd/_apis/Identities/34e23bae-b50a-60e7-8258-075090a1841a',
    _links: {
      avatar: {
        href:
          'https://dev.azure.com/hanneswidrig/_apis/GraphProfile/MemberAvatars/msa.MzRlMjNiYWUtYjUwYS03MGU3LTgyNTgtMDc1MDkwYTE4NDFh',
      },
    },
    id: '34e23bae-b50a-60e7-8258-075090a1841a',
    uniqueName: 'hannes_widrig@outlook.com',
    imageUrl: 'https://dev.azure.com/hanneswidrig/_api/_common/identityImage?id=34e23bae-b50a-60e7-8258-075090a1841a',
  },
  {
    reviewerUrl:
      'https://dev.azure.com/hanneswidrig/f2613275-db5d-4cbb-95c8-00ba53f76641/_apis/git/repositories/cd200cef-44c7-4839-8f93-57c6a0979eaa/pullRequests/1/reviewers/34e23bae-b50a-60e7-8258-075090a1841a',
    vote: 0,
    isFlagged: false,
    displayName: 'Hannes Widrig',
    url:
      'https://spsprodcus2.vssps.visualstudio.com/A3c1dfbfa-3808-4342-bb22-1929bc938ccd/_apis/Identities/34e23bae-b50a-60e7-8258-075090a1841a',
    _links: {
      avatar: {
        href:
          'https://dev.azure.com/hanneswidrig/_apis/GraphProfile/MemberAvatars/msa.MzRlMjNiYWUtYjUwYS03MGU3LTgyNTgtMDc1MDkwYTE4NDFh',
      },
    },
    id: '34e23bae-b50a-60e7-8258-075090a1841a',
    uniqueName: 'hannes_widrig@outlook.com',
    imageUrl: 'https://dev.azure.com/hanneswidrig/_api/_common/identityImage?id=34e23bae-b50a-60e7-8258-075090a1841a',
  },
  {
    reviewerUrl:
      'https://dev.azure.com/hanneswidrig/f2613275-db5d-4cbb-95c8-00ba53f76641/_apis/git/repositories/cd200cef-44c7-4839-8f93-57c6a0979eaa/pullRequests/1/reviewers/34e23bae-b50a-60e7-8258-075090a1841a',
    vote: -5,
    isFlagged: false,
    displayName: 'Hannes Widrig',
    url:
      'https://spsprodcus2.vssps.visualstudio.com/A3c1dfbfa-3808-4342-bb22-1929bc938ccd/_apis/Identities/34e23bae-b50a-60e7-8258-075090a1841a',
    _links: {
      avatar: {
        href:
          'https://dev.azure.com/hanneswidrig/_apis/GraphProfile/MemberAvatars/msa.MzRlMjNiYWUtYjUwYS03MGU3LTgyNTgtMDc1MDkwYTE4NDFh',
      },
    },
    id: '34e23bae-b50a-60e7-8258-075090a1841a',
    uniqueName: 'hannes_widrig@outlook.com',
    imageUrl: 'https://dev.azure.com/hanneswidrig/_api/_common/identityImage?id=34e23bae-b50a-60e7-8258-075090a1841a',
  },
  {
    reviewerUrl:
      'https://dev.azure.com/hanneswidrig/f2613275-db5d-4cbb-95c8-00ba53f76641/_apis/git/repositories/cd200cef-44c7-4839-8f93-57c6a0979eaa/pullRequests/1/reviewers/34e23bae-b50a-60e7-8258-075090a1841a',
    vote: -10,
    isFlagged: false,
    displayName: 'Hannes Widrig',
    url:
      'https://spsprodcus2.vssps.visualstudio.com/A3c1dfbfa-3808-4342-bb22-1929bc938ccd/_apis/Identities/34e23bae-b50a-60e7-8258-075090a1841a',
    _links: {
      avatar: {
        href:
          'https://dev.azure.com/hanneswidrig/_apis/GraphProfile/MemberAvatars/msa.MzRlMjNiYWUtYjUwYS03MGU3LTgyNTgtMDc1MDkwYTE4NDFh',
      },
    },
    id: '34e23bae-b50a-60e7-8258-075090a1841a',
    uniqueName: 'hannes_widrig@outlook.com',
    imageUrl: 'https://dev.azure.com/hanneswidrig/_api/_common/identityImage?id=34e23bae-b50a-60e7-8258-075090a1841a',
  },
  {
    reviewerUrl:
      'https://dev.azure.com/hanneswidrig/f2613275-db5d-4cbb-95c8-00ba53f76641/_apis/git/repositories/cd200cef-44c7-4839-8f93-57c6a0979eaa/pullRequests/1/reviewers/34e23bae-b50a-60e7-8258-075090a1841a',
    vote: -10,
    isFlagged: false,
    displayName: 'Hannes Widrig',
    url:
      'https://spsprodcus2.vssps.visualstudio.com/A3c1dfbfa-3808-4342-bb22-1929bc938ccd/_apis/Identities/34e23bae-b50a-60e7-8258-075090a1841a',
    _links: {
      avatar: {
        href:
          'https://dev.azure.com/hanneswidrig/_apis/GraphProfile/MemberAvatars/msa.MzRlMjNiYWUtYjUwYS03MGU3LTgyNTgtMDc1MDkwYTE4NDFh',
      },
    },
    id: '34e23bae-b50a-60e7-8258-075090a1841a',
    uniqueName: 'hannes_widrig@outlook.com',
    imageUrl: 'https://dev.azure.com/hanneswidrig/_api/_common/identityImage?id=34e23bae-b50a-60e7-8258-075090a1841a',
  },
] as IdentityRefWithVote[];

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
      <div className="tooltip-overflow-container">
        <div className="tooltip-overflow-title">
          <NoVote className="vote-status no-vote" />
          <span>Reviewers</span>
        </div>
        <div className="tooltip-overflow-parent">
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

export const reviewerPill = (reviewer: IdentityRefWithVote, i: number, ref?: (node: any) => void) => (
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
          <span style={{ paddingBottom: 2 }}>{reviewer.displayName}</span>
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
              isOverflow: totalWidth > 600,
              tagElement: reviewerPill(mockReviewers[index], index),
            },
          ];
        }

        return widths;
      }),
    [],
  );

  useEffect(() => {
    if (widths.length > 0) {
      setVisibleElements(widths.filter(w => !w.isOverflow));
      setHiddenElements(widths.filter(w => w.isOverflow));
    }
  }, [widths]);

  return (
    <div className="reviewers-container">
      <div className="reviewers-container-hidden">{mockReviewers.map((r, i) => reviewerPill(r, i, measureTag))}</div>
      <PillGroup overflow={1}>
        {visibleElements.length > 0 && visibleElements.map(ve => ve.tagElement)}
        {hiddenElements.length > 0 && <ReviewerOverflow hiddenElements={hiddenElements} />}
      </PillGroup>
    </div>
  );
};
