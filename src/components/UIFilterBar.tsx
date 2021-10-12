import React from 'react';
import Select from 'react-select';
import { IListBoxItem } from 'azure-devops-ui/ListBox';

import './UIFilterBar.scss';

import { useTypedSelector } from '../lib/utils';
import { toFilterItems } from '../state/transformData';

type FilterOption = { label: string; value: string };
const convertToOption = (filterItem: IListBoxItem): FilterOption => ({ label: filterItem.text as string, value: filterItem.id });

type UiSelectProps = { placeholder: string; options: FilterOption[]; setter: React.Dispatch<React.SetStateAction<FilterOption[]>> };
const UiSelect = ({ placeholder, options, setter }: UiSelectProps) => {
  return (
    <Select
      className="filter-bar-item"
      placeholder={placeholder}
      onChange={(next) => setter([...next])}
      getOptionLabel={({ label }) => label}
      getOptionValue={({ value }) => value}
      options={options}
      isDisabled={options.length === 0}
      isMulti
    />
  );
};

export const UIFilterBar = () => {
  const options = useTypedSelector((store) => toFilterItems(store.data.pullRequests));

  const [searchString, setSearchString] = React.useState<string>('');
  const [repositories, setRepositories] = React.useState<FilterOption[]>([]);
  const [sourceBranch, setSourceBranch] = React.useState<FilterOption[]>([]);
  const [targetBranch, setTargetBranch] = React.useState<FilterOption[]>([]);
  const [author, setAuthor] = React.useState<FilterOption[]>([]);
  const [reviewer, setReviewer] = React.useState<FilterOption[]>([]);
  const [myApprovalStatus, setMyApprovalStatus] = React.useState<FilterOption[]>([]);

  return (
    <div className="filter-bar">
      <input className="search-box" type="search" placeholder={'Search...'} onChange={(v) => setSearchString(v.target.value)} />
      <UiSelect placeholder={'Repositories'} options={options.repositories.map(convertToOption)} setter={setRepositories} />
      <UiSelect placeholder={'Source Branch'} options={options.sourceBranch.map(convertToOption)} setter={setSourceBranch} />
      <UiSelect placeholder={'Target Branch'} options={options.targetBranch.map(convertToOption)} setter={setTargetBranch} />
      <UiSelect placeholder={'PR Author'} options={options.author.map(convertToOption)} setter={setAuthor} />
      <UiSelect placeholder={'Assigned Reviewer'} options={options.reviewer.map(convertToOption)} setter={setReviewer} />
      <UiSelect placeholder={'My Approval Status'} options={options.myApprovalStatus.map(convertToOption)} setter={setMyApprovalStatus} />
    </div>
  );
};
