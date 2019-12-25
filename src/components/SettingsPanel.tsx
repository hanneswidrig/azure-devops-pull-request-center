import * as React from 'react';
import { Dispatch } from 'redux';
import { useDispatch } from 'react-redux';
import { Panel } from 'azure-devops-ui/Panel';
import { ChoiceGroup, IChoiceGroupOption, Stack, Toggle } from 'office-ui-fabric-react';

import { toggleSettingsPanel, setFullScreenMode } from '../state/actions';
import { PrHubState, DefaultSettings, TabOptions, SortDirection } from '../state/types';
import './SettingsPanel.scss';

const defaultSettingValues: DefaultSettings = {
  isFilterVisible: false,
  isFullScreenMode: false,
  selectedTab: 'active',
  sortDirection: 'desc',
};

type Props = { store: PrHubState };
export const SettingsPanel: React.FC<Props> = ({ store }: Props) => {
  const dispatch = useDispatch();
  const [settingValues, setSettingValues] = React.useState<DefaultSettings>({
    isFilterVisible: store.ui.isFilterVisible.value,
    isFullScreenMode: store.ui.isFullScreenMode,
    selectedTab: store.ui.selectedTab,
    sortDirection: store.ui.sortDirection,
  });
  // const [isDirty, setIsDirty] = React.useState<boolean>(false);

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
        { text: 'Reset', subtle: true, onClick: () => setSettingValues(defaultSettingValues) },
        { text: 'Save Changes', primary: true, onClick: () => saveChanges(store, settingValues, dispatch) },
        { text: 'Cancel', onClick: () => dispatch(toggleSettingsPanel()) },
      ]}
    >
      <Stack tokens={{ childrenGap: 8 }}>
        <ChoiceGroup
          label={'Default Full Screen Mode'}
          selectedKey={`${settingValues.isFullScreenMode}`}
          options={isFullScreenModeItems}
          onChange={(_, o) => isFullScreenModeChanged(o, setSettingValues)}
        />
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
) => void;

type ToggleChanged = (
  selectedOption: boolean | undefined,
  setSettingValues: React.Dispatch<React.SetStateAction<DefaultSettings>>,
) => void;

const isFullScreenModeChanged: ChoiceGroupChanged = (selectedOption, setSettingValues) => {
  const isFullScreenMode = selectedOption?.key === 'true' ?? false;
  setSettingValues(values => ({ ...values, isFullScreenMode: isFullScreenMode }));
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

type SaveChanges = (store: PrHubState, defaultSettings: DefaultSettings, dispatch: Dispatch<any>) => void;
const saveChanges: SaveChanges = (store, defaultSettings, dispatch) => {
  dispatch(setFullScreenMode(defaultSettings.isFullScreenMode));
};
