import React from 'react';
import Select from 'react-select';
import { useDispatch } from 'react-redux';

import './UiFilterBar.scss';

import { FilterOption } from '../state/types';
import { useTypedSelector } from '../lib/utils';
import { setFilterOptions } from '../state/actions';
import { deriveFilterOptions } from '../state/transformData';

type SearchBoxProps = { placeholder: string; setter: React.Dispatch<React.SetStateAction<FilterOption[]>> };
const SearchBox = ({ placeholder, setter }: SearchBoxProps) => {
  return (
    <input
      className="search-box"
      type="search"
      placeholder={placeholder}
      onChange={(e) => setter([{ label: e.target.value, value: e.target.value }])}
    />
  );
};

type UiSelectProps = { placeholder: string; options: FilterOption[]; setter: React.Dispatch<React.SetStateAction<FilterOption[]>> };
const UiMultiSelect = ({ placeholder, options, setter }: UiSelectProps) => {
  return (
    <Select
      className="filter-bar-item"
      placeholder={placeholder}
      onChange={(selectedValues) => setter([...selectedValues])}
      getOptionLabel={({ label }) => label}
      getOptionValue={({ value }) => value}
      options={options}
      isDisabled={options.length === 0}
      isMulti
    />
  );
};

export const UiFilterBar = () => {
  const filterOptions = useTypedSelector(({ data }) => deriveFilterOptions(data.pullRequests));
  const dispatch = useDispatch();

  const [searchString, setSearchString] = React.useState<FilterOption[]>([]);
  const [repositories, setRepositories] = React.useState<FilterOption[]>([]);
  const [sourceBranch, setSourceBranch] = React.useState<FilterOption[]>([]);
  const [targetBranch, setTargetBranch] = React.useState<FilterOption[]>([]);
  const [author, setAuthor] = React.useState<FilterOption[]>([]);
  const [reviewer, setReviewer] = React.useState<FilterOption[]>([]);
  const [myApprovalStatus, setMyApprovalStatus] = React.useState<FilterOption[]>([]);

  React.useEffect(() => {
    dispatch(setFilterOptions({ searchString, repositories, sourceBranch, targetBranch, author, reviewer, myApprovalStatus }));
  }, [dispatch, searchString, repositories, sourceBranch, targetBranch, author, reviewer, myApprovalStatus]);

  return (
    <div className="filter-bar">
      <SearchBox placeholder={'Search...'} setter={setSearchString} />
      <UiMultiSelect placeholder={'Repositories'} options={filterOptions.repositories} setter={setRepositories} />
      <UiMultiSelect placeholder={'Source Branch'} options={filterOptions.sourceBranch} setter={setSourceBranch} />
      <UiMultiSelect placeholder={'Target Branch'} options={filterOptions.targetBranch} setter={setTargetBranch} />
      <UiMultiSelect placeholder={'PR Author'} options={filterOptions.author} setter={setAuthor} />
      <UiMultiSelect placeholder={'Assigned Reviewer'} options={filterOptions.reviewer} setter={setReviewer} />
      <UiMultiSelect placeholder={'My Approval Status'} options={filterOptions.myApprovalStatus} setter={setMyApprovalStatus} />
    </div>
  );
};
