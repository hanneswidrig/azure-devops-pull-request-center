import React from 'react';
import { useDispatch } from 'react-redux';
import { VssPersona } from 'azure-devops-ui/VssPersona';
import { ComboBox, IComboBoxOption, IconButton, IRenderFunction, ISelectableOption, SelectableOptionMenuItemType } from '@fluentui/react';

import './UiFilterBar.css';

import { FilterOption } from '../state/types';
import { useTypedSelector } from '../lib/utils';
import { setFilterOptions } from '../state/actions';
import { getReviewerVoteIconStatus } from './StatusIcon';
import { deriveFilterOptions } from '../state/transformData';

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
      {getReviewerVoteIconStatus(option?.data?.value ?? '0')}
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
  const filterOptions = useTypedSelector(({ data }) => deriveFilterOptions(data.pullRequests));
  const isSavingFilterOptions = useTypedSelector(({ settings }) => settings.defaults.isSavingFilterOptions);
  const selectedFilterOptions = useTypedSelector(({ settings }) => settings.defaults.selectedFilterOptions);
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
