import React from 'react';
import { useDispatch } from 'react-redux';
import { Button } from 'azure-devops-ui/Button';
import Select, { components, GroupBase, MultiValueProps, MultiValueGenericProps, OptionProps, SelectComponentsConfig } from 'react-select';

import './UiFilterBar.css';

import { FilterOption } from '../state/types';
import { useTypedSelector } from '../lib/utils';
import { setFilterOptions } from '../state/actions';
import { getReviewerVoteIconStatus } from './StatusIcon';
import { deriveFilterOptions } from '../state/transformData';
import { VssPersona } from 'azure-devops-ui/VssPersona';

type CustomComponents = SelectComponentsConfig<FilterOption, true, GroupBase<FilterOption>> | undefined;
type CustomOptionProps = OptionProps<FilterOption, true, GroupBase<FilterOption>>;
type CustomMultiValueLabelProps = MultiValueProps<FilterOption, true, GroupBase<FilterOption>>;
type CustomMultiValueLabelGenericProps = (props: MultiValueGenericProps<FilterOption, true, GroupBase<FilterOption>>) => JSX.Element;

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

const CodeOption = (props: CustomOptionProps) => {
  return (
    <components.Option {...props}>
      <span style={{ fontFamily: `var(--font-family-monospace)` }}>{props.data.label}</span>
    </components.Option>
  );
};

const CodeMultiValueLabel = (props: CustomMultiValueLabelProps) => {
  return <span style={{ fontSize: '0.75rem', fontFamily: `var(--font-family-monospace)`, margin: '0.25rem' }}>{props.data.label}</span>;
};

const codeComponents: CustomComponents = {
  Option: CodeOption,
  MultiValueLabel: CodeMultiValueLabel as CustomMultiValueLabelGenericProps,
};

const PersonaOption = (props: CustomOptionProps) => {
  return (
    <components.Option {...props}>
      <div className="reviewers">
        <VssPersona className="vss-persona" imageUrl={props.data.href} size={'small'} />
        <span style={{ marginLeft: '0.25rem' }}>{props.data.label}</span>
      </div>
    </components.Option>
  );
};

const PersonaMultiValueLabel = (props: CustomMultiValueLabelProps) => {
  return <VssPersona className="vss-persona" imageUrl={props.data.href} size={'small'} />;
};

const personaComponents: CustomComponents = {
  Option: PersonaOption,
  MultiValueLabel: PersonaMultiValueLabel as CustomMultiValueLabelGenericProps,
};

const ApprovalStatusOption = (props: CustomOptionProps) => {
  return (
    <components.Option {...props}>
      <div className="approval-status">
        {getReviewerVoteIconStatus(props.data.value)}
        <span style={{ marginLeft: '0.25rem' }}>{props.data.label}</span>
      </div>
    </components.Option>
  );
};

const ApprovalStatusMultiValueLabel = (props: CustomMultiValueLabelProps) => {
  return getReviewerVoteIconStatus(props.data.value);
};

const approvalStatusComponents: CustomComponents = {
  Option: ApprovalStatusOption,
  MultiValueLabel: ApprovalStatusMultiValueLabel as CustomMultiValueLabelGenericProps,
};

type UiSelectProps = {
  placeholder: string;
  options: FilterOption[];
  value: FilterOption[];
  setter: React.Dispatch<React.SetStateAction<FilterOption[]>>;
  components: CustomComponents | undefined;
};
const UiMultiSelect = ({ placeholder, options, value, setter, components }: UiSelectProps) => {
  return (
    <Select
      className="filter-bar-item"
      styles={{
        placeholder: (existing) => ({ ...existing, fontSize: '0.8rem' }),
        control: (existing) => ({ ...existing, overflow: 'hidden' }),
        valueContainer: (existing) => ({
          ...existing,
          flexWrap: 'nowrap',
          overflowX: 'scroll',
          marginBottom: '-50px',
          paddingBottom: '50px',
        }),
        multiValue: (existing) => ({ ...existing, minWidth: 'max-content' }),
      }}
      components={components}
      placeholder={placeholder}
      onChange={(selectedValues) => setter([...selectedValues])}
      value={value}
      getOptionLabel={({ label }) => label}
      getOptionValue={({ value }) => value}
      options={options}
      closeMenuOnSelect={false}
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
      <div className="search-box-container">
        <Button iconProps={{ iconName: 'ClearFilter' }} subtle onClick={() => resetFilters()} />
        <SearchBox placeholder={'Search...'} value={searchString} setter={setSearchString} />
      </div>

      <UiMultiSelect
        placeholder={'Repositories'}
        options={filterOptions.repositories}
        value={repositories}
        setter={setRepositories}
        components={codeComponents}
      />

      <UiMultiSelect
        placeholder={'Source Branch'}
        options={filterOptions.sourceBranch}
        value={sourceBranch}
        setter={setSourceBranch}
        components={codeComponents}
      />

      <UiMultiSelect
        placeholder={'Target Branch'}
        options={filterOptions.targetBranch}
        value={targetBranch}
        setter={setTargetBranch}
        components={codeComponents}
      />

      <UiMultiSelect
        placeholder={'Author'}
        options={filterOptions.author}
        value={author}
        setter={setAuthor}
        components={personaComponents}
      />

      <UiMultiSelect
        placeholder={'Reviewers'}
        options={filterOptions.reviewer}
        value={reviewer}
        setter={setReviewer}
        components={personaComponents}
      />

      <UiMultiSelect
        placeholder={'Approval Status'}
        options={filterOptions.myApprovalStatus}
        value={myApprovalStatus}
        setter={setMyApprovalStatus}
        components={approvalStatusComponents}
      />
    </div>
  );
};
