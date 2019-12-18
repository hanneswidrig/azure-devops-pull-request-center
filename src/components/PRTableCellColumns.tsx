import React from 'react';
import { SimpleTableCell, ITableColumn } from 'azure-devops-ui/Table';

import { PR } from '../state/types';
import { sortByDisplayName } from '../lib/utils';
import { PRTableCellTitle } from './PRTableCellTitle';
import { PRTableCellReviewers } from './PRTableCellReviewers';
import { IdentityRefWithVote } from 'azure-devops-extension-api/Git/Git';

export const titleColumn = (
  rowIndex: number,
  columnIndex: number,
  tableColumn: ITableColumn<PR>,
  tableItem: PR,
): JSX.Element => (
  <SimpleTableCell className="padding-8" key={'col-' + columnIndex} columnIndex={columnIndex} tableColumn={tableColumn}>
    <PRTableCellTitle tableItem={tableItem} />
  </SimpleTableCell>
);

export const reviewersColumn = (
  rowIndex: number,
  columnIndex: number,
  tableColumn: ITableColumn<PR>,
  tableItem: PR,
): JSX.Element => {
  // const reviewers = tableItem.reviewers.sort(sortByDisplayName);
  const reviewers = tableItem.pullRequestId === 3 ? [...fakeReviewers] : [fakeReviewers[0], fakeReviewers[1]];
  return (
    <SimpleTableCell
      className="bolt-table-cell-content-with-inline-link no-v-padding"
      key={'col-' + columnIndex}
      columnIndex={columnIndex}
      tableColumn={tableColumn}
    >
      <PRTableCellReviewers reviewers={reviewers} />
    </SimpleTableCell>
  );
};

const fakeReviewers = ([
  {
    reviewerUrl:
      'https://dev.azure.com/AllisonTransmission/cf6a42b4-fe9b-4822-847f-e4773747701e/_apis/git/repositories/23091011-eb3e-43d2-9c31-b77ffbc042d7/pullRequests/952/reviewers/e5ca9980-4887-4088-bd7d-17ce6af44e04',
    vote: 5,
    isRequired: true,
    isFlagged: false,
    displayName: '[ISCAAN]\\ISCAAN Team',
    url:
      'https://spsprodcus1.vssps.visualstudio.com/Abf179c5c-dca4-40df-a8ca-8f8f277a5098/_apis/Identities/e5ca9980-4887-4088-bd7d-17ce6af44e04',
    _links: {
      avatar: {
        href:
          'https://dev.azure.com/AllisonTransmission/_apis/GraphProfile/MemberAvatars/vssgp.Uy0xLTktMTU1MTM3NDI0NS0zMDI0MjUxNTk5LTI2MTcxMjM0MDAtMjIyMjk3NDA3MS05Mjc0Mjg2MzgtMS05MzIzNjkwMjUtMTgxMDI3NjUxLTI5ODEwNDIyMTktOTAzNjMyMDYz',
      },
    },
    id: 'e5ca9980-4887-4088-bd7d-17ce6af44e04',
    uniqueName: 'vstfs:///Classification/TeamProject/cf6a42b4-fe9b-4822-847f-e4773747701e\\ISCAAN Team',
    imageUrl:
      'https://dev.azure.com/AllisonTransmission/_api/_common/identityImage?id=e5ca9980-4887-4088-bd7d-17ce6af44e04',
    isContainer: true,
  },
  {
    reviewerUrl:
      'https://dev.azure.com/AllisonTransmission/cf6a42b4-fe9b-4822-847f-e4773747701e/_apis/git/repositories/23091011-eb3e-43d2-9c31-b77ffbc042d7/pullRequests/952/reviewers/c7055cf2-5a03-640d-bc91-27b9abc059ec',
    vote: 5,
    votedFor: [
      {
        reviewerUrl:
          'https://dev.azure.com/AllisonTransmission/cf6a42b4-fe9b-4822-847f-e4773747701e/_apis/git/repositories/23091011-eb3e-43d2-9c31-b77ffbc042d7/pullRequests/952/reviewers/e5ca9980-4887-4088-bd7d-17ce6af44e04',
        vote: 0,
        displayName: '[ISCAAN]\\ISCAAN Team',
        url:
          'https://spsprodcus1.vssps.visualstudio.com/Abf179c5c-dca4-40df-a8ca-8f8f277a5098/_apis/Identities/e5ca9980-4887-4088-bd7d-17ce6af44e04',
        _links: {
          avatar: {
            href:
              'https://dev.azure.com/AllisonTransmission/_apis/GraphProfile/MemberAvatars/vssgp.Uy0xLTktMTU1MTM3NDI0NS0zMDI0MjUxNTk5LTI2MTcxMjM0MDAtMjIyMjk3NDA3MS05Mjc0Mjg2MzgtMS05MzIzNjkwMjUtMTgxMDI3NjUxLTI5ODEwNDIyMTktOTAzNjMyMDYz',
          },
        },
        id: 'e5ca9980-4887-4088-bd7d-17ce6af44e04',
        uniqueName: 'vstfs:///Classification/TeamProject/cf6a42b4-fe9b-4822-847f-e4773747701e\\ISCAAN Team',
        imageUrl:
          'https://dev.azure.com/AllisonTransmission/_api/_common/identityImage?id=e5ca9980-4887-4088-bd7d-17ce6af44e04',
        isContainer: true,
      },
    ],
    isFlagged: false,
    displayName: 'Travis Craft',
    url:
      'https://spsprodcus1.vssps.visualstudio.com/Abf179c5c-dca4-40df-a8ca-8f8f277a5098/_apis/Identities/c7055cf2-5a03-640d-bc91-27b9abc059ec',
    _links: {
      avatar: {
        href:
          'https://dev.azure.com/AllisonTransmission/_apis/GraphProfile/MemberAvatars/aad.YzcwNTVjZjItNWEwMy03NDBkLWJjOTEtMjdiOWFiYzA1OWVj',
      },
    },
    id: 'c7055cf2-5a03-640d-bc91-27b9abc059ec',
    uniqueName: 'OZMCBY@alsn.onmicrosoft.com',
    imageUrl:
      'https://dev.azure.com/AllisonTransmission/_api/_common/identityImage?id=c7055cf2-5a03-640d-bc91-27b9abc059ec',
  },
  {
    reviewerUrl:
      'https://dev.azure.com/AllisonTransmission/cf6a42b4-fe9b-4822-847f-e4773747701e/_apis/git/repositories/23091011-eb3e-43d2-9c31-b77ffbc042d7/pullRequests/952/reviewers/5c6e0356-9acd-6648-b082-8243006979d6',
    vote: 0,
    votedFor: [
      {
        reviewerUrl:
          'https://dev.azure.com/AllisonTransmission/cf6a42b4-fe9b-4822-847f-e4773747701e/_apis/git/repositories/23091011-eb3e-43d2-9c31-b77ffbc042d7/pullRequests/952/reviewers/e5ca9980-4887-4088-bd7d-17ce6af44e04',
        vote: 0,
        displayName: '[ISCAAN]\\ISCAAN Team',
        url:
          'https://spsprodcus1.vssps.visualstudio.com/Abf179c5c-dca4-40df-a8ca-8f8f277a5098/_apis/Identities/e5ca9980-4887-4088-bd7d-17ce6af44e04',
        _links: {
          avatar: {
            href:
              'https://dev.azure.com/AllisonTransmission/_apis/GraphProfile/MemberAvatars/vssgp.Uy0xLTktMTU1MTM3NDI0NS0zMDI0MjUxNTk5LTI2MTcxMjM0MDAtMjIyMjk3NDA3MS05Mjc0Mjg2MzgtMS05MzIzNjkwMjUtMTgxMDI3NjUxLTI5ODEwNDIyMTktOTAzNjMyMDYz',
          },
        },
        id: 'e5ca9980-4887-4088-bd7d-17ce6af44e04',
        uniqueName: 'vstfs:///Classification/TeamProject/cf6a42b4-fe9b-4822-847f-e4773747701e\\ISCAAN Team',
        imageUrl:
          'https://dev.azure.com/AllisonTransmission/_api/_common/identityImage?id=e5ca9980-4887-4088-bd7d-17ce6af44e04',
        isContainer: true,
      },
      {
        reviewerUrl:
          'https://dev.azure.com/AllisonTransmission/cf6a42b4-fe9b-4822-847f-e4773747701e/_apis/git/repositories/23091011-eb3e-43d2-9c31-b77ffbc042d7/pullRequests/952/reviewers/0d2bcb4b-f391-47d1-9559-9717ba616c0f',
        vote: 0,
        displayName: '[ISCAAN]\\API Governors',
        url:
          'https://spsprodcus1.vssps.visualstudio.com/Abf179c5c-dca4-40df-a8ca-8f8f277a5098/_apis/Identities/0d2bcb4b-f391-47d1-9559-9717ba616c0f',
        _links: {
          avatar: {
            href:
              'https://dev.azure.com/AllisonTransmission/_apis/GraphProfile/MemberAvatars/vssgp.Uy0xLTktMTU1MTM3NDI0NS0xNDI0MTAwNjI2LTMwNzkyNzM3OTUtMjE5MzUxMDAzMC0xNTkxNDM1NDM0LTEtMjQ5NDAxOTEwNS0xNzkzNDk4NDQ2LTI4Nzc4MDE5OTItMjMzMjMzMjQ',
          },
        },
        id: '0d2bcb4b-f391-47d1-9559-9717ba616c0f',
        uniqueName: 'vstfs:///Classification/TeamProject/cf6a42b4-fe9b-4822-847f-e4773747701e\\API Governors',
        imageUrl:
          'https://dev.azure.com/AllisonTransmission/_api/_common/identityImage?id=0d2bcb4b-f391-47d1-9559-9717ba616c0f',
        isContainer: true,
      },
    ],
    isFlagged: false,
    displayName: 'Hannes Widrig',
    url:
      'https://spsprodcus1.vssps.visualstudio.com/Abf179c5c-dca4-40df-a8ca-8f8f277a5098/_apis/Identities/5c6e0356-9acd-6648-b082-8243006979d6',
    _links: {
      avatar: {
        href:
          'https://dev.azure.com/AllisonTransmission/_apis/GraphProfile/MemberAvatars/aad.NWM2ZTAzNTYtOWFjZC03NjQ4LWIwODItODI0MzAwNjk3OWQ2',
      },
    },
    id: '5c6e0356-9acd-6648-b082-8243006979d6',
    uniqueName: 'AZFYQV@alsn.onmicrosoft.com',
    imageUrl:
      'https://dev.azure.com/AllisonTransmission/_api/_common/identityImage?id=5c6e0356-9acd-6648-b082-8243006979d6',
  },
  {
    reviewerUrl:
      'https://dev.azure.com/AllisonTransmission/cf6a42b4-fe9b-4822-847f-e4773747701e/_apis/git/repositories/23091011-eb3e-43d2-9c31-b77ffbc042d7/pullRequests/952/reviewers/0d2bcb4b-f391-47d1-9559-9717ba616c0f',
    vote: 0,
    isRequired: true,
    isFlagged: false,
    displayName: '[ISCAAN]\\API Governors',
    url:
      'https://spsprodcus1.vssps.visualstudio.com/Abf179c5c-dca4-40df-a8ca-8f8f277a5098/_apis/Identities/0d2bcb4b-f391-47d1-9559-9717ba616c0f',
    _links: {
      avatar: {
        href:
          'https://dev.azure.com/AllisonTransmission/_apis/GraphProfile/MemberAvatars/vssgp.Uy0xLTktMTU1MTM3NDI0NS0xNDI0MTAwNjI2LTMwNzkyNzM3OTUtMjE5MzUxMDAzMC0xNTkxNDM1NDM0LTEtMjQ5NDAxOTEwNS0xNzkzNDk4NDQ2LTI4Nzc4MDE5OTItMjMzMjMzMjQ',
      },
    },
    id: '0d2bcb4b-f391-47d1-9559-9717ba616c0f',
    uniqueName: 'vstfs:///Classification/TeamProject/cf6a42b4-fe9b-4822-847f-e4773747701e\\API Governors',
    imageUrl:
      'https://dev.azure.com/AllisonTransmission/_api/_common/identityImage?id=0d2bcb4b-f391-47d1-9559-9717ba616c0f',
    isContainer: true,
  },
  {
    reviewerUrl:
      'https://dev.azure.com/AllisonTransmission/cf6a42b4-fe9b-4822-847f-e4773747701e/_apis/git/repositories/23091011-eb3e-43d2-9c31-b77ffbc042d7/pullRequests/952/reviewers/0d2bcb4b-f391-47d1-9559-9717ba616c0f',
    vote: 0,
    isRequired: true,
    isFlagged: false,
    displayName: 'Donald Trump',
    url:
      'https://spsprodcus1.vssps.visualstudio.com/Abf179c5c-dca4-40df-a8ca-8f8f277a5098/_apis/Identities/0d2bcb4b-f391-47d1-9559-9717ba616c0f',
    _links: {
      avatar: {
        href:
          'https://dev.azure.com/AllisonTransmission/_apis/GraphProfile/MemberAvatars/vssgp.Uy0xLTktMTU1MTM3NDI0NS0xNDI0MTAwNjI2LTMwNzkyNzM3OTUtMjE5MzUxMDAzMC0xNTkxNDM1NDM0LTEtMjQ5NDAxOTEwNS0xNzkzNDk4NDQ2LTI4Nzc4MDE5OTItMjMzMjMzMjQ',
      },
    },
    id: '0d2bcb4b-f391-47d1-9559-9717ba616c00',
    uniqueName: 'vstfs:///Classification/TeamProject/cf6a42b4-fe9b-4822-847f-e4773747701e\\API Governors',
    imageUrl:
      'https://dev.azure.com/AllisonTransmission/_api/_common/identityImage?id=0d2bcb4b-f391-47d1-9559-9717ba616c0f',
    isContainer: true,
  },
] as any) as IdentityRefWithVote[];
