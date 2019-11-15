import React from 'react';
import { IFilter } from 'azure-devops-ui/Utilities/Filter';
import { ObservableValue } from 'azure-devops-ui/Core/Observable';
import { IHeaderCommandBarItem, HeaderCommandBarWithFilter } from 'azure-devops-ui/HeaderCommandBar';

export type Props = {
  filter: IFilter;
  items: IHeaderCommandBarItem[];
  isFilterVisible: ObservableValue<boolean>;
};
export const TabBarFilterIcon: React.FC<Props> = (props: Props) => (
  <HeaderCommandBarWithFilter filter={props.filter} items={props.items} filterToggled={props.isFilterVisible} />
);
