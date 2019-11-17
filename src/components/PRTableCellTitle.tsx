import React from 'react';
import { Ago } from 'azure-devops-ui/Ago';
import { Duration } from 'azure-devops-ui/Duration';
import { Link } from 'azure-devops-ui/Link';
import { Tooltip } from 'azure-devops-ui/TooltipEx';
import { VssPersona } from 'azure-devops-ui/VssPersona';

import { Tag } from './Tag';
import './PRTableCellTitle.scss';
import { PR } from '../state/types';
import { PRTableCellBranches } from './PRTableCellBranches';

export const PRTableCellTitle: React.FC<{ tableItem: PR }> = ({ tableItem }: { tableItem: PR }) => {
  return (
    <div className="flex-column ui-container">
      <div className="flex-row line-one">
        <PRAuthorPersona tableItem={tableItem} />
        <div className="pr-title-wrapper">
          <div className="pr-title">
            <Tooltip text={tableItem.title} overflowOnly>
              <Link
                className="font-size-m text-ellipsis bolt-table-inline-link bolt-table-link"
                excludeTabStop
                href={tableItem.href}
                target="_blank"
              >
                {tableItem.title}
              </Link>
            </Tooltip>
            {tableItem.isDraft && <Tag title={'Draft'} type={'draft'}></Tag>}
            {tableItem.isAutoComplete && <Tag title={'Auto Complete'} type={'autoComplete'}></Tag>}
          </div>
          <div className="pr-info">
            <span className="secondary-text body-s">
              <span className="margin-right-4">{tableItem.secondaryTitle}</span>
              {`•`}
              <Ago className="margin-left-4 margin-right-4" date={tableItem.creationDate} />
              {`•`}
              <Duration className="margin-left-4" startDate={tableItem.creationDate} endDate={new Date(Date.now())} />
            </span>
          </div>
        </div>
      </div>
      <div className="flex-row line-two">
        <PRTableCellBranches tableItem={tableItem}></PRTableCellBranches>
      </div>
    </div>
  );
};

const PRAuthorPersona: React.FC<{ tableItem: PR }> = ({ tableItem }: { tableItem: PR }) => (
  <VssPersona
    className="margin-right-8"
    imageUrl={tableItem.createdBy._links['avatar'].href}
    size={'medium-plus'}
    displayName={tableItem.createdBy.displayName}
  />
);
