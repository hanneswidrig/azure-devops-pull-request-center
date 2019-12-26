import * as React from 'react';
import { Dispatch } from 'redux';
import { useDispatch, useSelector } from 'react-redux';
import { Panel } from 'azure-devops-ui/Panel';
import { ChoiceGroup, IChoiceGroupOption, Stack, Toggle } from 'office-ui-fabric-react';

import {
  toggleSettingsPanel,
  setFullScreenMode,
  setSelectedTab,
  setSortDirection,
  setFilterBar,
  saveSettings,
} from '../state/actions';
import { DefaultSettings, TabOptions, SortDirection, PrHubState } from '../state/types';
import './SettingsPanel.scss';

const defaultSettingValues: DefaultSettings = {
  isFilterVisible: false,
  isFullScreenMode: false,
  selectedTab: 'active',
  sortDirection: 'desc',
};

export const SettingsPanel: React.FC = () => {
  const store = useSelector((store: PrHubState) => store);
  const dispatch = useDispatch();
  const [settingValues, setSettingValues] = React.useState<DefaultSettings>({
    isFilterVisible: store.settings.defaults.isFilterVisible,
    isFullScreenMode: store.settings.defaults.isFullScreenMode,
    selectedTab: store.settings.defaults.selectedTab,
    sortDirection: store.settings.defaults.sortDirection,
  });
  const [isDirty, setIsDirty] = React.useState<boolean>(false);

  React.useEffect(() => {
    setIsDirty(JSON.stringify(settingValues) !== JSON.stringify(store.settings.defaults));
  }, [settingValues, store.settings.defaults]);

  return (
    <Panel
      size={0}
      showSeparator
      onDismiss={() => dispatch(toggleSettingsPanel())}
      titleProps={{
        text: 'Extension Preferences',
      }}
      description={'Pull Requests Center 1.1.0'}
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
        <ChoiceGroup
          label={'Full Screen Mode'}
          selectedKey={`${settingValues.isFullScreenMode}`}
          options={isFullScreenModeItems}
          onChange={(_, o) => isFullScreenModeChanged(o, setSettingValues, dispatch)}
        />
        <div style={{ marginTop: 32 }}></div>
        <Toggle
          label={'Default Filter Bar Visible'}
          onText="On"
          offText="Off"
          checked={settingValues.isFilterVisible}
          onChange={(_, o) => isFilterVisibleChanged(o, setSettingValues)}
        />
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

const isFullScreenModeItems: IChoiceGroupOption[] = [
  { key: 'false', text: 'Disabled', iconProps: { iconName: 'BackToWindow', title: 'Show Azure DevOps UI Shell' } },
  { key: 'true', text: 'Enabled', iconProps: { iconName: 'FullScreen', title: 'Hide Azure DevOps UI Shell' } },
];

const selectedTabItems: IChoiceGroupOption[] = [
  { key: 'active', text: 'Active' },
  { key: 'draft', text: 'Draft' },
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

type ToggleChanged = (
  selectedOption: boolean | undefined,
  setSettingValues: React.Dispatch<React.SetStateAction<DefaultSettings>>,
) => void;

const isFullScreenModeChanged: ChoiceGroupChanged = (selectedOption, setSettingValues, dispatch) => {
  const isFullScreenMode = selectedOption?.key === 'true' ?? false;
  setSettingValues(values => ({ ...values, isFullScreenMode: isFullScreenMode }));
  if (dispatch) {
    dispatch(setFullScreenMode(isFullScreenMode));
  }
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

type ResetChanges = (
  setSettingValues: React.Dispatch<React.SetStateAction<DefaultSettings>>,
  dispatch: Dispatch<any>,
) => void;
const resetChanges: ResetChanges = (setSettingValues, dispatch) => {
  setSettingValues(defaultSettingValues);
  dispatch(setFullScreenMode(defaultSettingValues.isFullScreenMode));
};

type ApplyChanges = (defaultSettings: DefaultSettings, dispatch: Dispatch<any>) => void;
const applyChanges: ApplyChanges = (defaultSettings, dispatch) => {
  dispatch(setFilterBar(defaultSettings.isFilterVisible));
  dispatch(setSelectedTab(defaultSettings.selectedTab));
  dispatch(setSortDirection(defaultSettings.sortDirection));
  dispatch(saveSettings(defaultSettings));
  dispatch(toggleSettingsPanel());
};
