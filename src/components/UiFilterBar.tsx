import React from 'react';
import Select from 'react-select';
import { useDispatch } from 'react-redux';

import './UiFilterBar.scss';

import { FilterOption } from '../state/types';
import { useTypedSelector } from '../lib/utils';
import { setFilterOptionSearchString } from '../state/actions';

type UiSelectProps = { placeholder: string; options: FilterOption[] };
const UiMultiSelect = ({ placeholder, options }: UiSelectProps) => {
  return (
    <Select
      className="filter-bar-item"
      placeholder={placeholder}
      // onChange={(next) => setter([...next])}
      getOptionLabel={({ label }) => label}
      getOptionValue={({ value }) => value}
      options={options}
      isDisabled={options.length === 0}
      isMulti
    />
  );
};

export const UiFilterBar = () => {
  const filterOptions = useTypedSelector((store) => store.data.filterOptions);
  const dispatch = useDispatch();
  return (
    <div className="filter-bar">
      <input
        className="search-box"
        type="search"
        placeholder="Search..."
        onChange={(e) => dispatch(setFilterOptionSearchString({ searchString: [{ label: e.target.value, value: e.target.value }] }))}
      />
      <UiMultiSelect placeholder={'Repositories'} options={filterOptions.repositories} />
      <UiMultiSelect placeholder={'Source Branch'} options={filterOptions.sourceBranch} />
      <UiMultiSelect placeholder={'Target Branch'} options={filterOptions.targetBranch} />
      <UiMultiSelect placeholder={'PR Author'} options={filterOptions.author} />
      <UiMultiSelect placeholder={'Assigned Reviewer'} options={filterOptions.reviewer} />
      <UiMultiSelect placeholder={'My Approval Status'} options={filterOptions.myApprovalStatus} />
    </div>
  );
};
