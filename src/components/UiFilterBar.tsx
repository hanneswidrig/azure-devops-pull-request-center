import React from 'react';
import { deepEqual } from 'fast-equals';
import { useDispatch } from 'react-redux';
import { VssPersona } from 'azure-devops-ui/VssPersona';
import { ComboBox, IComboBoxOption, IconButton, IRenderFunction, ISelectableOption, SelectableOptionMenuItemType } from '@fluentui/react';

import './UiFilterBar.css';

import { applyPreciseFilters } from '../lib/filters';
import { actions, useAppSelector } from '../state/store';
import { getReviewerVoteIconStatus } from './StatusIcon';
import { deriveFilterOptions } from '../state/transformData';
import { FilterOption, FilterOptions } from '../state/types';

const refineFilterOptions = (derivedFilterOptions: FilterOptions, selectedFilterOptions: FilterOptions): FilterOptions => {
  return {
    searchString: selectedFilterOptions.searchString,
    author: selectedFilterOptions.author.filter((selected) =>
      derivedFilterOptions.author.find((derived) => derived.value === selected.value)
    ),
    repositories: selectedFilterOptions.repositories.filter((selected) =>
      derivedFilterOptions.repositories.find((derived) => derived.value === selected.value)
    ),
    sourceBranch: selectedFilterOptions.sourceBranch.filter((selected) =>
      derivedFilterOptions.sourceBranch.find((derived) => derived.value === selected.value)
    ),
    targetBranch: selectedFilterOptions.targetBranch.filter((selected) =>
      derivedFilterOptions.targetBranch.find((derived) => derived.value === selected.value)
    ),
    myApprovalStatus: selectedFilterOptions.myApprovalStatus,
    reviewer: selectedFilterOptions.reviewer.filter((selected) =>
      derivedFilterOptions.reviewer.find((derived) => derived.value === selected.value)
    ),
  };
};

const selectAllOption: IComboBoxOption = { key: 'selectAll', text: 'Select All', itemType: SelectableOptionMenuItemType.SelectAll };
const dividerOption: IComboBoxOption = { key: 'divider', text: '-', itemType: SelectableOptionMenuItemType.Divider };

const personaComponents = (option: ISelectableOption<FilterOption | undefined> | undefined) => {
  if (option?.itemType === SelectableOptionMenuItemType.SelectAll) {
    return <span>{option?.text ?? ''}</span>;
  }

  return (
    <>
      <VssPersona className="vss-persona" imageUrl={option?.data?.href ?? ''} size={'small'} />
      <span style={{ marginLeft: '0.25rem' }}>{option?.data?.label ?? ''}</span>
    </>
  );
};

const approvalStatusComponents = (option: ISelectableOption<FilterOption | undefined> | undefined) => {
  if (option?.itemType === SelectableOptionMenuItemType.SelectAll) {
    return <span>{option?.text ?? ''}</span>;
  }

  return (
    <div className="approval-status">
      {getReviewerVoteIconStatus(option?.data?.value ?? '-1')}
      <span style={{ marginLeft: '0.25rem' }}>{option?.data?.label ?? ''}</span>
    </div>
  );
};

type UiSelectProps = {
  placeholder: string;
  allOptions: FilterOption[];
  selectedOptions: FilterOption[];
  setter: React.Dispatch<React.SetStateAction<FilterOption[]>>;
  components?: IRenderFunction<ISelectableOption<FilterOption>>;
};
const UiMultiSelect = ({ placeholder, allOptions, selectedOptions, setter, components }: UiSelectProps) => {
  const onChange = (option?: IComboBoxOption): void => {
    if (!option) {
      return;
    }

    if (option.itemType === SelectableOptionMenuItemType.SelectAll) {
      setter(option.selected === true ? [...allOptions] : []);
    } else {
      const addOption = [...selectedOptions, option.data];
      const removeOption = [...selectedOptions.filter(({ value }) => value !== option.key)];
      setter(option.selected === true ? addOption : removeOption);
    }
  };

  const selectedKeys = selectedOptions.map(({ value }) => value);
  const derivedOptions = allOptions.map((option) => ({ key: option.value, text: option.label, data: option }));
  const isSelectAll = selectedOptions.length === allOptions.length;

  return (
    <ComboBox
      multiSelect={true}
      useComboBoxAsMenuWidth={true}
      onRenderOption={components}
      placeholder={placeholder}
      selectedKey={isSelectAll ? [selectAllOption.key as string, ...selectedKeys] : selectedKeys}
      onChange={(_, option) => onChange(option)}
      options={[selectAllOption, dividerOption, ...derivedOptions]}
    />
  );
};

export const UiFilterBar = () => {
  const filterOptions = useAppSelector(({ data, ui }) =>
    deriveFilterOptions(applyPreciseFilters(data.pullRequests, ui.selectedTab, ui.daysAgo))
  );
  const isSavingFilterOptions = useAppSelector(({ settings }) => settings.defaults.isSavingFilterOptions);
  const selectedFilterOptions = useAppSelector(
    ({ settings }) => refineFilterOptions(filterOptions, settings.defaults.selectedFilterOptions),
    deepEqual
  );
  const dispatch = useDispatch();

  const [searchString, setSearchString] = React.useState<FilterOption[]>([]);
  const [repositories, setRepositories] = React.useState<FilterOption[]>([]);
  const [sourceBranch, setSourceBranch] = React.useState<FilterOption[]>([]);
  const [targetBranch, setTargetBranch] = React.useState<FilterOption[]>([]);
  const [author, setAuthor] = React.useState<FilterOption[]>([]);
  const [reviewer, setReviewer] = React.useState<FilterOption[]>([]);
  const [myApprovalStatus, setMyApprovalStatus] = React.useState<FilterOption[]>([]);

  React.useEffect(() => {
    setSearchString(selectedFilterOptions.searchString);
    setRepositories(selectedFilterOptions.repositories);
    setSourceBranch(selectedFilterOptions.sourceBranch);
    setTargetBranch(selectedFilterOptions.targetBranch);
    setAuthor(selectedFilterOptions.author);
    setReviewer(selectedFilterOptions.reviewer);
    setMyApprovalStatus(selectedFilterOptions.myApprovalStatus);
  }, [dispatch, selectedFilterOptions]);

  React.useEffect(() => {
    dispatch(actions.setFilterOptions({ searchString, repositories, sourceBranch, targetBranch, author, reviewer, myApprovalStatus }));
  }, [dispatch, searchString, repositories, sourceBranch, targetBranch, author, reviewer, myApprovalStatus, isSavingFilterOptions]);

  const resetFilters = () => {
    setSearchString([]);
    setAuthor([]);
    setRepositories([]);
    setSourceBranch([]);
    setTargetBranch([]);
    setMyApprovalStatus([]);
    setReviewer([]);
  };

  return (
    <div className="filter-bar">
      <div className="search-box-container">
        <IconButton iconProps={{ iconName: 'ClearFilter' }} onClick={() => resetFilters()} />
        <input
          className="search-box"
          type="search"
          placeholder={'Search...'}
          value={searchString[0]?.value ?? ''}
          onChange={(e) => setSearchString([{ label: e?.target?.value ?? '', value: e?.target?.value ?? '' }])}
        />
      </div>

      <UiMultiSelect
        placeholder={'Author'}
        allOptions={filterOptions.author}
        selectedOptions={author}
        setter={setAuthor}
        components={personaComponents}
      />

      <UiMultiSelect
        placeholder={'Repositories'}
        allOptions={filterOptions.repositories}
        selectedOptions={repositories}
        setter={setRepositories}
      />

      <UiMultiSelect
        placeholder={'Source Branch'}
        allOptions={filterOptions.sourceBranch}
        selectedOptions={sourceBranch}
        setter={setSourceBranch}
      />

      <UiMultiSelect
        placeholder={'Target Branch'}
        allOptions={filterOptions.targetBranch}
        selectedOptions={targetBranch}
        setter={setTargetBranch}
      />

      <UiMultiSelect
        placeholder={'Approval Status'}
        allOptions={filterOptions.myApprovalStatus}
        selectedOptions={myApprovalStatus}
        setter={setMyApprovalStatus}
        components={approvalStatusComponents}
      />

      <UiMultiSelect
        placeholder={'Reviewers'}
        allOptions={filterOptions.reviewer}
        selectedOptions={reviewer}
        setter={setReviewer}
        components={personaComponents}
      />
    </div>
  );
};
