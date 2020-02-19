import * as React from 'react';
import { Dispatch } from 'redux';
import { useDispatch } from 'react-redux';
import { Panel } from 'azure-devops-ui/Panel';
import {
  ChoiceGroup,
  IChoiceGroupOption,
  Stack,
  Toggle,
  Label,
  CompoundButton,
  DefaultButton,
  IContextualMenuProps,
} from 'office-ui-fabric-react';

import {
  toggleSettingsPanel,
  setFullScreenMode,
  setSelectedTab,
  setSortDirection,
  setFilterBar,
  saveSettings,
  setRefreshDuration,
} from '../state/actions';
import { filter } from '..';
import './SettingsPanel.scss';
import { useTypedSelector } from '../lib/utils';
import { getCurrentFilterValues } from '../tabs/TabProvider';
import { DefaultSettings, TabOptions, SortDirection, RefreshDuration } from '../state/types';

type SetSettingValuesCallback = React.Dispatch<React.SetStateAction<DefaultSettings>>;

export const defaultSettingValues: DefaultSettings = {
  isFilterVisible: false,
  isFullScreenMode: false,
  selectedTab: 'active',
  sortDirection: 'desc',
  isSavingFilterItems: false,
  filterValues: undefined,
  autoRefreshDuration: 'off',
};

const isFullScreenModeItems: IChoiceGroupOption[] = [
  { key: 'false', text: 'Disabled', iconProps: { iconName: 'SidePanel', title: 'Show Azure DevOps UI Shell' } },
  { key: 'true', text: 'Enabled', iconProps: { iconName: 'ScaleUp', title: 'Hide Azure DevOps UI Shell' } },
];

const selectedTabItems: IChoiceGroupOption[] = [
  { key: 'active', text: 'Active' },
  { key: 'draft', text: 'Draft' },
  { key: 'completed', text: 'Completed (25 Most Recent)' },
];

const sortDirectionItems: IChoiceGroupOption[] = [
  { key: 'desc', text: 'Newest First', iconProps: { iconName: 'SortDown' } },
  { key: 'asc', text: 'Oldest First', iconProps: { iconName: 'SortUp' } },
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
  dispatch: Dispatch<any>,
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

type ChoiceGroupChanged = (
  selectedOption: IChoiceGroupOption | undefined,
  setSettingValues: SetSettingValuesCallback,
  dispatch?: Dispatch<any>,
) => void;

type CompoundButtonChanged = (decision: 'save' | 'clear', setSettingValues: SetSettingValuesCallback) => void;

type ToggleChanged = (selectedOption: boolean | undefined, setSettingValues: SetSettingValuesCallback) => void;

type AutoRefreshDurationChanged = (
  duration: RefreshDuration,
  setSettingValues: SetSettingValuesCallback,
  dispatch: Dispatch<any>,
) => void;

type ResetChanges = (setSettingValues: SetSettingValuesCallback, dispatch: Dispatch<any>) => void;

type ApplyChanges = (defaultSettings: DefaultSettings, dispatch: Dispatch<any>) => void;

const isFullScreenModeChanged: ChoiceGroupChanged = (selectedOption, setSettingValues, dispatch) => {
  const isFullScreenMode = selectedOption?.key === 'true' ?? false;
  setSettingValues(values => ({ ...values, isFullScreenMode: isFullScreenMode }));
  if (dispatch) {
    dispatch(setFullScreenMode({ isFullScreenMode: isFullScreenMode }));
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

const autoRefreshDurationChanged: AutoRefreshDurationChanged = (duration, setSettingValues, dispatch) => {
  setSettingValues(values => ({ ...values, autoRefreshDuration: duration }));
  dispatch(setRefreshDuration({ refreshDuration: duration }));
};

const resetChanges: ResetChanges = (setSettingValues, dispatch) => {
  setSettingValues(defaultSettingValues);
  dispatch(setRefreshDuration({ refreshDuration: 'off' }));
  dispatch(setFullScreenMode({ isFullScreenMode: defaultSettingValues.isFullScreenMode }));
};

const applyChanges: ApplyChanges = (defaultSettings, dispatch) => {
  dispatch(setFilterBar({ isFilterVisible: defaultSettings.isFilterVisible }));
  dispatch(setSelectedTab({ newSelectedTab: defaultSettings.selectedTab }));
  dispatch(setSortDirection({ sortDirection: defaultSettings.sortDirection }));
  dispatch(saveSettings({ defaultSettings: defaultSettings }));
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

  const filterValuesNotEqual =
    left.filterValues?.repositories?.length !== right.filterValues?.repositories?.length ||
    left.filterValues?.sourceBranch?.length !== right.filterValues?.sourceBranch?.length ||
    left.filterValues?.targetBranch?.length !== right.filterValues?.targetBranch?.length ||
    left.filterValues?.author?.length !== right.filterValues?.author?.length ||
    left.filterValues?.reviewer?.length !== right.filterValues?.reviewer?.length ||
    left.filterValues?.myApprovalStatus?.length !== right.filterValues?.myApprovalStatus?.length;

  const selectedTabNotEqual =
    (left.selectedTab ?? defaultSettingValues.selectedTab) !== (right.selectedTab ?? defaultSettingValues.selectedTab);

  const sortDirectionNotEqual =
    (left.sortDirection ?? defaultSettingValues.sortDirection) !==
    (right.sortDirection ?? defaultSettingValues.sortDirection);

  const autoRefreshDurationNotEqual =
    (left.autoRefreshDuration ?? defaultSettingValues.autoRefreshDuration) !==
    (right.autoRefreshDuration ?? defaultSettingValues.autoRefreshDuration);

  return (
    isFilterVisibleNotEqual ||
    isFullScreenModeNotEqual ||
    isSavingFilterItemsNotEqual ||
    filterValuesNotEqual ||
    selectedTabNotEqual ||
    sortDirectionNotEqual ||
    autoRefreshDurationNotEqual
  );
};

export const SettingsPanel = () => {
  const store = useTypedSelector(store => store);
  const defaultDuration = useTypedSelector(store => store.settings.defaults.autoRefreshDuration);
  const dispatch = useDispatch();
  const [settingValues, setSettingValues] = React.useState<DefaultSettings>({
    isFilterVisible: store.settings.defaults.isFilterVisible,
    isFullScreenMode: store.settings.defaults.isFullScreenMode || store.ui.isFullScreenMode,
    selectedTab: store.settings.defaults.selectedTab,
    sortDirection: store.settings.defaults.sortDirection,
    isSavingFilterItems: store.settings.defaults.isSavingFilterItems,
    filterValues: store.settings.defaults.isSavingFilterItems ? getCurrentFilterValues(filter) : undefined,
    autoRefreshDuration: defaultDuration !== 'off' ? defaultDuration : store.settings.autoRefreshDuration,
  });
  const [isDirty, setIsDirty] = React.useState<boolean>(false);

  React.useEffect(() => {
    setIsDirty(defaultSettingsEquality(settingValues, store.settings.defaults));
  }, [settingValues, store.settings.defaults]);

  return (
    <Panel
      size={0}
      onDismiss={() => dispatch(toggleSettingsPanel())}
      titleProps={{
        text: 'Extension Preferences',
      }}
      description={'Pull Requests Center 1.2.3'}
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
        ></DefaultButton>
        <div>
          <Label className="light-dark-toggle">Full Screen Mode</Label>
          <ChoiceGroup
            selectedKey={`${settingValues.isFullScreenMode}`}
            options={isFullScreenModeItems}
            onChange={(_, o) => isFullScreenModeChanged(o, setSettingValues, dispatch)}
          />
        </div>
        <div style={{ marginTop: 8 }}></div>
        <div>
          <Label className="light-dark-toggle">Filter Bar: Visible by Default</Label>
          <Toggle
            onText="On"
            offText="Off"
            checked={settingValues.isFilterVisible}
            onChange={(_, o) => isFilterVisibleChanged(o, setSettingValues)}
          />
        </div>
        <Label className="light-dark-toggle">Currently Selected Filter Values</Label>
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
        <div>
          <Label className="light-dark-toggle">Default Selected Tab</Label>
          <ChoiceGroup
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
      </Stack>
    </Panel>
  );
};
