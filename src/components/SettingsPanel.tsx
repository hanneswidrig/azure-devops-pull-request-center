import * as React from 'react';
import { Dispatch } from 'redux';
import { Panel } from 'azure-devops-ui/Panel';
import { useDispatch, useSelector } from 'react-redux';
import { ChoiceGroup, IChoiceGroupOption, Stack, Toggle, Label, CompoundButton } from 'office-ui-fabric-react';

import {
  toggleSettingsPanel,
  setFullScreenMode,
  setSelectedTab,
  setSortDirection,
  setFilterBar,
  saveSettings,
} from '../state/actions';
import { filter } from '..';
import { getCurrentFilterValues } from '../tabs/TabProvider';
import { DefaultSettings, TabOptions, SortDirection, PrHubState } from '../state/types';
import './SettingsPanel.scss';

const defaultSettingValues: DefaultSettings = {
  isFilterVisible: false,
  isFullScreenMode: false,
  selectedTab: 'active',
  sortDirection: 'desc',
  isSavingFilterItems: false,
  filterValues: undefined,
};

const isFullScreenModeItems: IChoiceGroupOption[] = [
  { key: 'false', text: 'Disabled', iconProps: { iconName: 'SidePanel', title: 'Show Azure DevOps UI Shell' } },
  { key: 'true', text: 'Enabled', iconProps: { iconName: 'ScaleUp', title: 'Hide Azure DevOps UI Shell' } },
];

const selectedTabItems: IChoiceGroupOption[] = [
  { key: 'active', text: 'Active' },
  { key: 'draft', text: 'Draft' },
  { key: 'recentlyCompleted', text: 'Completed (10 Most Recent)' },
];

const sortDirectionItems: IChoiceGroupOption[] = [
  { key: 'desc', text: 'Newest First', iconProps: { iconName: 'SortDown' } },
  { key: 'asc', text: 'Oldest First', iconProps: { iconName: 'SortUp' } },
];

type ChoiceGroupChanged = (
  selectedOption: IChoiceGroupOption | undefined,
  setSettingValues: React.Dispatch<React.SetStateAction<DefaultSettings>>,
  dispatch?: Dispatch<any>,
) => void;

type CompoundButtonChanged = (
  decision: 'save' | 'clear',
  setSettingValues: React.Dispatch<React.SetStateAction<DefaultSettings>>,
) => void;

type ToggleChanged = (
  selectedOption: boolean | undefined,
  setSettingValues: React.Dispatch<React.SetStateAction<DefaultSettings>>,
) => void;

type ResetChanges = (
  setSettingValues: React.Dispatch<React.SetStateAction<DefaultSettings>>,
  dispatch: Dispatch<any>,
) => void;

type ApplyChanges = (defaultSettings: DefaultSettings, dispatch: Dispatch<any>) => void;

const isFullScreenModeChanged: ChoiceGroupChanged = (selectedOption, setSettingValues, dispatch) => {
  const isFullScreenMode = selectedOption?.key === 'true' ?? false;
  setSettingValues(values => ({ ...values, isFullScreenMode: isFullScreenMode }));
  if (dispatch) {
    dispatch(setFullScreenMode(isFullScreenMode));
  }
};

const isSavingFilterItemsChanged: CompoundButtonChanged = (decision, setSettingValues) => {
  const isSavingFilterItems = decision === 'save';
  setSettingValues(values => ({ ...values, isSavingFilterItems: isSavingFilterItems }));
  setSettingValues(values => ({
    ...values,
    filterValues: isSavingFilterItems ? getCurrentFilterValues(filter) : undefined,
  }));
};

const isFilterVisibleChanged: ToggleChanged = (selectedOption, setSettingValues) => {
  setSettingValues((values: DefaultSettings) => ({ ...values, isFilterVisible: selectedOption ?? false }));
};

const selectedTabChanged: ChoiceGroupChanged = (selectedOption, setSettingValues) => {
  const option = selectedTabItems.find(option => option.key === selectedOption?.key) ?? selectedTabItems[0];
  setSettingValues(values => ({ ...values, selectedTab: option.key as TabOptions }));
};

const sortDirectionChanged: ChoiceGroupChanged = (selectedOption, setSettingValues) => {
  const option = sortDirectionItems.find(option => option.key === selectedOption?.key) ?? sortDirectionItems[0];
  setSettingValues(values => ({ ...values, sortDirection: option.key as SortDirection }));
};

const resetChanges: ResetChanges = (setSettingValues, dispatch) => {
  setSettingValues(defaultSettingValues);
  dispatch(setFullScreenMode(defaultSettingValues.isFullScreenMode));
};

const applyChanges: ApplyChanges = (defaultSettings, dispatch) => {
  dispatch(setFilterBar(defaultSettings.isFilterVisible));
  dispatch(setSelectedTab(defaultSettings.selectedTab));
  dispatch(setSortDirection(defaultSettings.sortDirection));
  dispatch(saveSettings(defaultSettings));
  dispatch(toggleSettingsPanel());
};

const defaultSettingsEquality = (left: DefaultSettings, right: DefaultSettings): boolean => {
  const isFilterVisibleNotEqual =
    (left.isFilterVisible ?? defaultSettingValues.isFilterVisible) !==
    (right.isFilterVisible ?? defaultSettingValues.isFilterVisible);

  const isFullScreenModeNotEqual =
    (left.isFullScreenMode ?? defaultSettingValues.isFullScreenMode) !==
    (right.isFullScreenMode ?? defaultSettingValues.isFullScreenMode);

  const isSavingFilterItemsNotEqual =
    (left.isSavingFilterItems ?? defaultSettingValues.isSavingFilterItems) !==
    (right.isSavingFilterItems ?? defaultSettingValues.isSavingFilterItems);

  const selectedTabNotEqual =
    (left.selectedTab ?? defaultSettingValues.selectedTab) !== (right.selectedTab ?? defaultSettingValues.selectedTab);

  const sortDirectionNotEqual =
    (left.sortDirection ?? defaultSettingValues.sortDirection) !==
    (right.sortDirection ?? defaultSettingValues.sortDirection);

  return (
    isFilterVisibleNotEqual ||
    isFullScreenModeNotEqual ||
    isSavingFilterItemsNotEqual ||
    selectedTabNotEqual ||
    sortDirectionNotEqual
  );
};

export const SettingsPanel: React.FC = () => {
  const store = useSelector((store: PrHubState) => store);
  const dispatch = useDispatch();
  const [settingValues, setSettingValues] = React.useState<DefaultSettings>({
    isFilterVisible: store.settings.defaults.isFilterVisible,
    isFullScreenMode: store.settings.defaults.isFullScreenMode || store.ui.isFullScreenMode,
    selectedTab: store.settings.defaults.selectedTab,
    sortDirection: store.settings.defaults.sortDirection,
    isSavingFilterItems: store.settings.defaults.isSavingFilterItems,
    filterValues: store.settings.defaults.filterValues,
  });
  const [isDirty, setIsDirty] = React.useState<boolean>(false);

  React.useEffect(() => {
    setIsDirty(defaultSettingsEquality(settingValues, store.settings.defaults));
  }, [settingValues, store.settings.defaults]);

  return (
    <Panel
      size={0}
      showSeparator
      onDismiss={() => dispatch(toggleSettingsPanel())}
      titleProps={{
        text: 'Extension Preferences',
      }}
      description={'Pull Requests Center 1.1.1'}
      footerButtonProps={[
        { text: 'Reset', subtle: true, onClick: () => resetChanges(setSettingValues, dispatch) },
        {
          text: 'Apply Changes',
          primary: true,
          onClick: () => applyChanges(settingValues, dispatch),
          disabled: !isDirty,
        },
      ]}
    >
      <Stack tokens={{ childrenGap: 12 }}>
        <ChoiceGroup
          label={'Full Screen Mode'}
          selectedKey={`${settingValues.isFullScreenMode}`}
          options={isFullScreenModeItems}
          onChange={(_, o) => isFullScreenModeChanged(o, setSettingValues, dispatch)}
        />
        <div style={{ marginTop: 36 }}></div>
        <Toggle
          label={'Filter Bar Visible by Default'}
          onText="On"
          offText="Off"
          checked={settingValues.isFilterVisible}
          onChange={(_, o) => isFilterVisibleChanged(o, setSettingValues)}
        />
        <Label>Currently Selected Filter Values</Label>
        <CompoundButton
          iconProps={{ iconName: 'Save' }}
          secondaryText={`Default to currently selected values.`}
          onClick={() => isSavingFilterItemsChanged('save', setSettingValues)}
          primary={settingValues.isSavingFilterItems}
        >
          Save
        </CompoundButton>
        <CompoundButton
          iconProps={{ iconName: 'ClearFilter' }}
          secondaryText={`Remove default selected values.`}
          onClick={() => isSavingFilterItemsChanged('clear', setSettingValues)}
          disabled={!settingValues.isSavingFilterItems}
        >
          Clear
        </CompoundButton>
        <ChoiceGroup
          label={'Default Selected Tab'}
          selectedKey={settingValues.selectedTab}
          options={selectedTabItems}
          onChange={(_, o) => selectedTabChanged(o, setSettingValues)}
        />
        <ChoiceGroup
          label={'Default PR Sort Direction'}
          selectedKey={settingValues.sortDirection}
          options={sortDirectionItems}
          onChange={(_, o) => sortDirectionChanged(o, setSettingValues)}
        />
      </Stack>
    </Panel>
  );
};
