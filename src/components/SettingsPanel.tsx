import * as React from 'react';
import { produce } from 'immer';
import { useDispatch } from 'react-redux';
import { Panel } from 'azure-devops-ui/Panel';
import { ChoiceGroup, IChoiceGroupOption, Stack, Toggle } from 'office-ui-fabric-react';

import { TabOptions } from '../tabs/TabTypes';
import { toggleSettingsPanel } from '../state/actions';
import { PrHubState, DefaultSettings, SortDirection } from '../state/types';
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
  const [settingValues, setSettingValues] = React.useState<DefaultSettings>(defaultSettingValues);

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
        { text: 'Save Changes', primary: true, onClick: () => console.log(settingValues) },
        { text: 'Cancel', onClick: () => dispatch(toggleSettingsPanel()) },
      ]}
    >
      <Stack tokens={{ childrenGap: 8 }}>
        <ChoiceGroup
          label={'Full Screen Mode'}
          selectedKey={`${settingValues.isFullScreenMode}`}
          options={isFullScreenModeItems}
          onChange={(e, o) => ({})}
        />
        <Toggle
          label={'Default Filter Bar Visible'}
          onText="On"
          offText="Off"
          checked={settingValues.isFilterVisible}
          onChange={(e, o) =>
            setSettingValues((values: DefaultSettings) => ({ ...values, isFilterVisible: o ?? false }))
          }
        />
        <ChoiceGroup
          label={'Default Selected Tab'}
          selectedKey={settingValues.selectedTab}
          options={selectedTabItems}
          onChange={(e, o) => ({})}
        />
        <ChoiceGroup
          label={'Default PR Sort Direction'}
          selectedKey={settingValues.sortDirection}
          options={sortDirectionItems}
          onChange={(e, o) => ({})}
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

// type UpdateSettingValue = (
//   optionKey: keyof DefaultSettings,
//   options: IChoiceGroupOption[],
//   selectedOption: IChoiceGroupOption | undefined,
//   setSettingValues: React.Dispatch<React.SetStateAction<DefaultSettings>>,
// ) => void;
// const updateSettingValue: UpdateSettingValue = (optionKey, options, selectedOption, setSettingValues) => {
//   setSettingValues((values: DefaultSettings) =>
//     produce(values, draft => {
//       draft.selectedTab = (optionKey === 'selectedTab'
//         ? options.find(option => option.key === selectedOption?.key)?.key ?? options[0].key
//         : draft.selectedTab) as TabOptions;
//       draft.sortDirection = (optionKey === 'sortDirection'
//         ? options.find(option => option.key === selectedOption?.key)?.key ?? options[0].key
//         : draft.sortDirection) as SortDirection;
//     }),
//   );
// };
