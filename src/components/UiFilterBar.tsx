import React from 'react';
import Select from 'react-select';
import { useDispatch } from 'react-redux';

import './UiFilterBar.scss';

import { FilterOption } from '../state/types';
import { useTypedSelector } from '../lib/utils';
import { setFilterOptions } from '../state/actions';
import { deriveFilterOptions } from '../state/transformData';
import { Button } from 'azure-devops-ui/Button';

type SearchBoxProps = { placeholder: string; value: FilterOption[]; setter: React.Dispatch<React.SetStateAction<FilterOption[]>> };
const SearchBox = ({ placeholder, value, setter }: SearchBoxProps) => {
  return (
    <input
      className="search-box"
      type="search"
      placeholder={placeholder}
      value={value[0]?.value ?? ''}
      onChange={(e) => setter([{ label: e.target.value, value: e.target.value }])}
    />
  );
};

type UiSelectProps = {
  placeholder: string;
  options: FilterOption[];
  value: FilterOption[];
  setter: React.Dispatch<React.SetStateAction<FilterOption[]>>;
};
const UiMultiSelect = ({ placeholder, options, value, setter }: UiSelectProps) => {
  return (
    <Select
      className="filter-bar-item"
      placeholder={placeholder}
      onChange={(selectedValues) => setter([...selectedValues])}
      value={value}
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
  const isSavingFilterOptions = useTypedSelector((store) => store.settings.defaults.isSavingFilterOptions);
  const selectedFilterOptions = useTypedSelector((store) => store.settings.defaults.selectedFilterOptions);
  const dispatch = useDispatch();

  const [searchString, setSearchString] = React.useState<FilterOption[]>([]);
  const [repositories, setRepositories] = React.useState<FilterOption[]>([]);
  const [sourceBranch, setSourceBranch] = React.useState<FilterOption[]>([]);
  const [targetBranch, setTargetBranch] = React.useState<FilterOption[]>([]);
  const [author, setAuthor] = React.useState<FilterOption[]>([]);
  const [reviewer, setReviewer] = React.useState<FilterOption[]>([]);
  const [myApprovalStatus, setMyApprovalStatus] = React.useState<FilterOption[]>([]);

  React.useEffect(() => {
    if (isSavingFilterOptions) {
      setSearchString(selectedFilterOptions.searchString);
      setRepositories(selectedFilterOptions.repositories);
      setSourceBranch(selectedFilterOptions.sourceBranch);
      setTargetBranch(selectedFilterOptions.targetBranch);
      setAuthor(selectedFilterOptions.author);
      setReviewer(selectedFilterOptions.reviewer);
      setMyApprovalStatus(selectedFilterOptions.myApprovalStatus);
    }
  }, [isSavingFilterOptions, selectedFilterOptions]);

  React.useEffect(() => {
    dispatch(setFilterOptions({ searchString, repositories, sourceBranch, targetBranch, author, reviewer, myApprovalStatus }));
  }, [dispatch, searchString, repositories, sourceBranch, targetBranch, author, reviewer, myApprovalStatus, isSavingFilterOptions]);

  const resetFilters = () => {
    setSearchString([]);
    setRepositories([]);
    setSourceBranch([]);
    setTargetBranch([]);
    setAuthor([]);
    setReviewer([]);
    setMyApprovalStatus([]);
  };

  return (
    <div className="filter-bar">
      <Button iconProps={{ iconName: 'ClearFilter' }} subtle onClick={() => resetFilters()} />
      <SearchBox placeholder={'Search...'} value={searchString} setter={setSearchString} />
      <UiMultiSelect placeholder={'Repositories'} options={filterOptions.repositories} value={repositories} setter={setRepositories} />
      <UiMultiSelect placeholder={'Source Branch'} options={filterOptions.sourceBranch} value={sourceBranch} setter={setSourceBranch} />
      <UiMultiSelect placeholder={'Target Branch'} options={filterOptions.targetBranch} value={targetBranch} setter={setTargetBranch} />
      <UiMultiSelect placeholder={'PR Author'} options={filterOptions.author} value={author} setter={setAuthor} />
      <UiMultiSelect placeholder={'Assigned Reviewer'} options={filterOptions.reviewer} value={reviewer} setter={setReviewer} />
      <UiMultiSelect
        placeholder={'My Approval Status'}
        options={filterOptions.myApprovalStatus}
        value={myApprovalStatus}
        setter={setMyApprovalStatus}
      />
    </div>
  );
};
