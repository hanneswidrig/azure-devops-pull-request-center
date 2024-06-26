import React from 'react';
import { Dispatch } from 'redux';
import { Panel } from 'azure-devops-ui/Panel';
import {
  Label,
  Stack,
  ComboBox,
  ChoiceGroup,
  DefaultButton,
  CompoundButton,
  IComboBoxOption,
  IChoiceGroupOption,
  IContextualMenuProps,
  IStyleFunctionOrObject,
  IChoiceGroupStyles,
  IChoiceGroupStyleProps,
} from '@fluentui/react';

import './SettingsPanel.scss';
import { defaults } from '../state/transformData';
import { asyncActions, actions, useAppDispatch, useAppSelector } from '../state/store';
import { DefaultSettings, TabOptions, SortDirection, RefreshDuration, FilterOption, DaysAgo } from '../state/types';

const radioButtonStyles: Partial<IStyleFunctionOrObject<IChoiceGroupStyleProps, IChoiceGroupStyles>> = {
  flexContainer: {
    '& > .ms-ChoiceField': {
      color: `var(--text-primary-color)`,
    },
  },
};

type SetSettingValuesCallback = React.Dispatch<React.SetStateAction<DefaultSettings>>;

type ChoiceGroupChanged = (
  selectedOption: IComboBoxOption | IChoiceGroupOption | undefined,
  setSettingValues: SetSettingValuesCallback,
  dispatch?: Dispatch<any>
) => void;

const isFullScreenModeItems: IChoiceGroupOption[] = [
  { key: 'false', text: 'Disabled', iconProps: { iconName: 'SidePanel', title: 'Show Azure DevOps UI Shell' } },
  { key: 'true', text: 'Enabled', iconProps: { iconName: 'ScaleUp', title: 'Hide Azure DevOps UI Shell' } },
];

const selectedTabItems: IChoiceGroupOption[] = [
  { key: 'active', text: 'Active' },
  { key: 'draft', text: 'Draft' },
  { key: 'completed', text: 'Completed' },
];

const sortDirectionItems: IChoiceGroupOption[] = [
  { key: 'desc', text: 'Newest First', iconProps: { iconName: 'SortDown' } },
  { key: 'asc', text: 'Oldest First', iconProps: { iconName: 'SortUp' } },
];

const daysAgoItems: IComboBoxOption[] = [
  { key: '7', text: '7 Days' },
  { key: '14', text: '14 Days' },
  { key: '30', text: '1 Month' },
  { key: '90', text: '3 Months' },
  { key: '180', text: '6 Months' },
  { key: '365', text: '12 Months' },
  { key: '-1', text: 'All Time' },
];

const autoRefreshItems: Record<RefreshDuration, string> = {
  off: 'Turn off',
  '60': '1 minute',
  '300': '5 minutes',
  '900': '15 minutes',
  '3600': '1 hour',
};

export const getDurationText = (refreshDuration: RefreshDuration) => {
  return autoRefreshItems[refreshDuration];
};

const autoRefreshMenuItems: (
  settingValues: DefaultSettings,
  setSettingValues: SetSettingValuesCallback,
  dispatch: Dispatch<any>
) => IContextualMenuProps = (settingValues, setSettingValues, dispatch) => ({
  items: [
    {
      key: 'off' as RefreshDuration,
      text: autoRefreshItems['off'],
      onClick: () => autoRefreshDurationChanged('off', setSettingValues, dispatch),
      disabled: settingValues.autoRefreshDuration === 'off',
    },
    {
      key: '60' as RefreshDuration,
      text: autoRefreshItems['60'],
      onClick: () => autoRefreshDurationChanged('60', setSettingValues, dispatch),
    },
    {
      key: '300' as RefreshDuration,
      text: autoRefreshItems['300'],
      onClick: () => autoRefreshDurationChanged('300', setSettingValues, dispatch),
    },
    {
      key: '900' as RefreshDuration,
      text: autoRefreshItems['900'],
      onClick: () => autoRefreshDurationChanged('900', setSettingValues, dispatch),
    },
    {
      key: '3600' as RefreshDuration,
      text: autoRefreshItems['3600'],
      onClick: () => autoRefreshDurationChanged('3600', setSettingValues, dispatch),
    },
  ],
});

const isFullScreenModeChanged: ChoiceGroupChanged = (selectedOption, setSettingValues, dispatch) => {
  const isFullScreenMode = selectedOption?.key === 'true' ?? false;
  setSettingValues((values) => ({ ...values, isFullScreenMode }));
  if (dispatch) {
    dispatch(asyncActions.setFullScreenMode(isFullScreenMode));
  }
};

const isSavingFilterItemsChanged = (decision: 'save' | 'clear', setSettingValues: SetSettingValuesCallback): void => {
  setSettingValues((values) => ({ ...values, isSavingFilterOptions: decision === 'save' }));
};

const selectedTabChanged: ChoiceGroupChanged = (selectedOption, setSettingValues) => {
  const option = selectedTabItems.find((option) => option.key === selectedOption?.key) ?? selectedTabItems[0];
  setSettingValues((values) => ({ ...values, selectedTab: option.key as TabOptions }));
};

const sortDirectionChanged: ChoiceGroupChanged = (selectedOption, setSettingValues) => {
  const option = sortDirectionItems.find((option) => option.key === selectedOption?.key) ?? sortDirectionItems[0];
  setSettingValues((values) => ({ ...values, sortDirection: option.key as SortDirection }));
};

const daysAgoChanged: ChoiceGroupChanged = (selectedOption, setSettingValues) => {
  const option = daysAgoItems.find((option) => option.key === selectedOption?.key) ?? daysAgoItems[0];
  setSettingValues((values) => ({ ...values, daysAgo: option.key as DaysAgo }));
};

const autoRefreshDurationChanged = (
  duration: RefreshDuration,
  setSettingValues: SetSettingValuesCallback,
  dispatch: Dispatch<any>
): void => {
  setSettingValues((values) => ({ ...values, autoRefreshDuration: duration }));
  dispatch(actions.setRefreshDuration(duration));
};

const resetChanges = (setSettingValues: SetSettingValuesCallback, dispatch: Dispatch<any>): void => {
  setSettingValues(defaults());
  dispatch(actions.setRefreshDuration('off'));
  dispatch(asyncActions.setFullScreenMode(defaults().isFullScreenMode));
};

const applyChanges = (defaultSettings: DefaultSettings, dispatch: Dispatch<any>): void => {
  dispatch(actions.setSelectedTab(defaultSettings.selectedTab));
  dispatch(actions.setSortDirection(defaultSettings.sortDirection));
  dispatch(asyncActions.saveSettings(defaultSettings));
  dispatch(actions.toggleSettingsPanel());
};

const isNotEqual = (a: FilterOption[], b: FilterOption[]): boolean => {
  const aValues = a.map((v) => v.value.toLocaleLowerCase());
  const bValues = b.map((v) => v.value.toLocaleLowerCase());
  return aValues.some((v) => !bValues.includes(v)) || aValues.length !== bValues.length;
};

const defaultSettingsEquality = (a: DefaultSettings, b: DefaultSettings): boolean => {
  const { isFullScreenMode, selectedTab, sortDirection, daysAgo, isSavingFilterOptions, selectedFilterOptions, autoRefreshDuration } =
    defaults();

  const isFullScreenModeCheck = (a.isFullScreenMode ?? isFullScreenMode) !== (b.isFullScreenMode ?? isFullScreenMode);
  const isSavingFilterOptionsCheck =
    (a.isSavingFilterOptions ?? isSavingFilterOptions) !== (b.isSavingFilterOptions ?? isSavingFilterOptions);
  const selectedFilterOptionsCheck =
    isNotEqual(
      (a.selectedFilterOptions ?? selectedFilterOptions.searchString).searchString,
      (b.selectedFilterOptions ?? selectedFilterOptions.searchString).searchString
    ) ||
    isNotEqual(
      (a.selectedFilterOptions ?? selectedFilterOptions.repositories).repositories,
      (b.selectedFilterOptions ?? selectedFilterOptions.repositories).repositories
    ) ||
    isNotEqual(
      (a.selectedFilterOptions ?? selectedFilterOptions.sourceBranch).sourceBranch,
      (b.selectedFilterOptions ?? selectedFilterOptions.sourceBranch).sourceBranch
    ) ||
    isNotEqual(
      (a.selectedFilterOptions ?? selectedFilterOptions.targetBranch).targetBranch,
      (b.selectedFilterOptions ?? selectedFilterOptions.targetBranch).targetBranch
    ) ||
    isNotEqual(
      (a.selectedFilterOptions ?? selectedFilterOptions.author).author,
      (b.selectedFilterOptions ?? selectedFilterOptions.author).author
    ) ||
    isNotEqual(
      (a.selectedFilterOptions ?? selectedFilterOptions.reviewer).reviewer,
      (b.selectedFilterOptions ?? selectedFilterOptions.reviewer).reviewer
    ) ||
    isNotEqual(
      (a.selectedFilterOptions ?? selectedFilterOptions.myApprovalStatus).myApprovalStatus,
      (b.selectedFilterOptions ?? selectedFilterOptions.myApprovalStatus).myApprovalStatus
    );
  const daysAgoCheck = (a.daysAgo ?? daysAgo) !== (b.daysAgo ?? daysAgo);
  const selectedTabCheck = (a.selectedTab ?? selectedTab) !== (b.selectedTab ?? selectedTab);
  const sortDirectionCheck = (a.sortDirection ?? sortDirection) !== (b.sortDirection ?? sortDirection);
  const autoRefreshDurationCheck = (a.autoRefreshDuration ?? autoRefreshDuration) !== (b.autoRefreshDuration ?? autoRefreshDuration);

  return (
    isFullScreenModeCheck ||
    isSavingFilterOptionsCheck ||
    (a.isSavingFilterOptions ? selectedFilterOptionsCheck : false) ||
    selectedTabCheck ||
    daysAgoCheck ||
    sortDirectionCheck ||
    autoRefreshDurationCheck
  );
};

export const SettingsPanel = () => {
  const store = useAppSelector((store) => store);
  const filterOptions = useAppSelector((store) => store.data.filterOptions);
  const defaultDuration = useAppSelector((store) => store.settings.defaults.autoRefreshDuration);
  const dispatch = useAppDispatch();

  const [settingValues, setSettingValues] = React.useState<DefaultSettings>({
    isFullScreenMode: store.settings.defaults.isFullScreenMode || store.ui.isFullScreenMode,
    selectedTab: store.settings.defaults.selectedTab,
    sortDirection: store.settings.defaults.sortDirection,
    daysAgo: store.settings.defaults.daysAgo,
    isSavingFilterOptions: store.settings.defaults.isSavingFilterOptions,
    selectedFilterOptions: filterOptions,
    autoRefreshDuration: defaultDuration !== 'off' ? defaultDuration : store.settings.autoRefreshDuration,
  });
  const [isDirty, setIsDirty] = React.useState<boolean>(false);

  React.useEffect(() => {
    setIsDirty(defaultSettingsEquality(settingValues, store.settings.defaults));
  }, [settingValues, store.settings.defaults]);

  return (
    <Panel
      size={0}
      onDismiss={() => dispatch(actions.toggleSettingsPanel())}
      titleProps={{ text: 'Extension Preferences' }}
      description={'Pull Requests Center 3.1.0'}
      footerButtonProps={[
        { text: 'Reset', subtle: true, onClick: () => resetChanges(setSettingValues, dispatch) },
        {
          text: 'Apply Changes',
          primary: true,
          onClick: () => applyChanges(settingValues, dispatch),
          disabled: !isDirty,
        },
      ]}>
      <Stack tokens={{ childrenGap: 8 }}>
        <DefaultButton
          primary={settingValues.autoRefreshDuration !== 'off'}
          text={
            settingValues.autoRefreshDuration !== 'off'
              ? `Enabled: ${getDurationText(settingValues.autoRefreshDuration)}`
              : 'Auto Refresh Disabled'
          }
          iconProps={{ iconName: 'Timer' }}
          menuProps={autoRefreshMenuItems(settingValues, setSettingValues, dispatch)}
        />
        <div>
          <Label className="light-dark-toggle">Full Screen Mode</Label>
          <ChoiceGroup
            selectedKey={`${settingValues.isFullScreenMode}`}
            options={isFullScreenModeItems}
            onChange={(_, o) => isFullScreenModeChanged(o, setSettingValues, dispatch)}
          />
        </div>
        <Label className="light-dark-toggle">Currently Selected Filter Values</Label>
        <CompoundButton
          iconProps={{ iconName: 'Save' }}
          secondaryText={`Default to currently selected values.`}
          onClick={() => isSavingFilterItemsChanged('save', setSettingValues)}
          primary={settingValues.isSavingFilterOptions}>
          Save
        </CompoundButton>
        <CompoundButton
          iconProps={{ iconName: 'ClearFilter' }}
          secondaryText={`Remove default selected values.`}
          onClick={() => isSavingFilterItemsChanged('clear', setSettingValues)}
          disabled={!settingValues.isSavingFilterOptions}>
          Clear
        </CompoundButton>
        <div>
          <Label className="light-dark-toggle">Default Selected Tab</Label>
          <ChoiceGroup
            styles={radioButtonStyles}
            selectedKey={settingValues.selectedTab}
            options={selectedTabItems}
            onChange={(_, o) => selectedTabChanged(o, setSettingValues)}
          />
        </div>
        <div>
          <Label className="light-dark-toggle">Default PR Sort Direction</Label>
          <ChoiceGroup
            selectedKey={settingValues.sortDirection}
            options={sortDirectionItems}
            onChange={(_, o) => sortDirectionChanged(o, setSettingValues)}
          />
        </div>
        <div>
          <Label className="light-dark-toggle">Days Ago</Label>
          <ComboBox selectedKey={settingValues.daysAgo} options={daysAgoItems} onChange={(_, o) => daysAgoChanged(o, setSettingValues)} />
        </div>
      </Stack>
    </Panel>
  );
};
