import React from 'react';
import Select from 'react-select';
import { useDispatch } from 'react-redux';

import './UiFilterBar.scss';

import { FilterOption } from '../state/types';
import { useTypedSelector } from '../lib/utils';
import { Dispatch } from 'redux';

type UiSelectProps = { placeholder: string; options: FilterOption[]; dispatch: Dispatch<any> };
const UiSelect = ({ placeholder, options }: UiSelectProps) => {
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
      <input className="search-box" type="search" placeholder={'Search...'} />
      <UiSelect placeholder={'Repositories'} options={filterOptions.repositories} dispatch={dispatch} />
      <UiSelect placeholder={'Source Branch'} options={filterOptions.sourceBranch} dispatch={dispatch} />
      <UiSelect placeholder={'Target Branch'} options={filterOptions.targetBranch} dispatch={dispatch} />
      <UiSelect placeholder={'PR Author'} options={filterOptions.author} dispatch={dispatch} />
      <UiSelect placeholder={'Assigned Reviewer'} options={filterOptions.reviewer} dispatch={dispatch} />
      <UiSelect placeholder={'My Approval Status'} options={filterOptions.myApprovalStatus} dispatch={dispatch} />
    </div>
  );
};
