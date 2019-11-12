import React from 'react';
import { IFilter } from 'azure-devops-ui/Utilities/Filter';
import { ObservableValue } from 'azure-devops-ui/Core/Observable';
import { IHeaderCommandBarItem, HeaderCommandBarWithFilter } from 'azure-devops-ui/HeaderCommandBar';

export interface TabBarFilterIconProps {
  filter: IFilter;
  items: IHeaderCommandBarItem[];
  isFilterVisible: ObservableValue<boolean>;
}
export const TabBarFilterIcon: React.FC<TabBarFilterIconProps> = (props: TabBarFilterIconProps) => (
  <HeaderCommandBarWithFilter filter={props.filter} items={props.items} filterToggled={props.isFilterVisible} />
);
