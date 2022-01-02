import { createLogger } from 'redux-logger';
import { IUserContext } from 'azure-devops-extension-sdk';
import { PullRequestStatus } from 'azure-devops-extension-api/Git/Git';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { createSlice, configureStore, PayloadAction, createAsyncThunk, isAnyOf } from '@reduxjs/toolkit';

import {
  displayErrorMessage,
  criteria,
  fetchPullRequests,
  getRepositories,
  getSettings,
  setFullScreenModeState,
  setSettings,
} from './actions';
import { initialState } from './initialState';
import { sortByCreationDate } from '../lib/utils';
import { defaults } from '../components/SettingsPanel';
import { DaysAgo, DefaultSettings, FilterOptions, RefreshDuration, SortDirection, TabOptions } from './types';

const getPullRequests = createAsyncThunk('root/getPullRequests', async (_, thunkAPI) => {
  try {
    const repos = await getRepositories();
    const allActivePrs = await Promise.all(repos.flatMap((repo) => fetchPullRequests(repo, criteria(PullRequestStatus.Active), 25)));
    const allCompletedPrs = await Promise.all(repos.flatMap((repo) => fetchPullRequests(repo, criteria(PullRequestStatus.Completed), 25)));
    const activePullRequests = allActivePrs.reduce((prev, curr) => [...prev, ...curr], []);
    const completedPullRequests = allCompletedPrs.reduce((prev, curr) => [...prev, ...curr], []);
    return [...activePullRequests, ...completedPullRequests];
  } catch {
    await displayErrorMessage();
    return thunkAPI.rejectWithValue([]);
  }
});

const restoreSettings = createAsyncThunk('root/restoreSettings', async (_, thunkAPI) => {
  try {
    const settings = await getSettings();
    if (settings) {
      await setFullScreenModeState(settings.isFullScreenMode);
      return settings;
    }

    return setSettings(defaults);
  } catch {
    await displayErrorMessage();
    return thunkAPI.rejectWithValue(defaults);
  }
});

const setFullScreenMode = createAsyncThunk('root/setFullScreenMode', async (isFullScreenMode: boolean) => {
  return setFullScreenModeState(isFullScreenMode);
});

const saveSettings = createAsyncThunk('root/saveSettings', async (defaultSettings: DefaultSettings) => {
  return setSettings(defaultSettings);
});

export const rootSlice = createSlice({
  name: 'root',
  initialState: initialState,
  reducers: {
    setCurrentUser: (state, action: PayloadAction<IUserContext>) => {
      state.data.currentUser = action.payload;
    },
    setSortDirection: (state, action: PayloadAction<SortDirection>) => {
      state.ui.sortDirection = action.payload;
      state.data.pullRequests = [...state.data.pullRequests].sort((a, b) => sortByCreationDate(a, b, action.payload));
    },
    setDaysAgo: (state, action: PayloadAction<DaysAgo>) => {
      state.ui.daysAgo = action.payload;
      state.data.pullRequests = [...state.data.pullRequests].sort((a, b) => sortByCreationDate(a, b, state.ui.sortDirection));
    },
    setSelectedTab: (state, action: PayloadAction<TabOptions>) => void (state.ui.selectedTab = action.payload),
    setRefreshDuration: (state, action: PayloadAction<RefreshDuration>) => void (state.settings.autoRefreshDuration = action.payload),
    setFilterOptions: (state, action: PayloadAction<FilterOptions>) => {
      const filterOptions = action.payload;
      state.data.filterOptions.searchString = filterOptions.searchString;
      state.data.filterOptions.repositories = filterOptions.repositories;
      state.data.filterOptions.sourceBranch = filterOptions.sourceBranch;
      state.data.filterOptions.targetBranch = filterOptions.targetBranch;
      state.data.filterOptions.author = filterOptions.author;
      state.data.filterOptions.reviewer = filterOptions.reviewer;
      state.data.filterOptions.myApprovalStatus = filterOptions.myApprovalStatus;
    },
    setSelectedFilterOptions: (state, action: PayloadAction<FilterOptions>) => {
      const filterOptions = action.payload;
      state.settings.defaults.selectedFilterOptions.searchString = filterOptions.searchString;
      state.settings.defaults.selectedFilterOptions.repositories = filterOptions.repositories;
      state.settings.defaults.selectedFilterOptions.sourceBranch = filterOptions.sourceBranch;
      state.settings.defaults.selectedFilterOptions.targetBranch = filterOptions.targetBranch;
      state.settings.defaults.selectedFilterOptions.author = filterOptions.author;
      state.settings.defaults.selectedFilterOptions.reviewer = filterOptions.reviewer;
      state.settings.defaults.selectedFilterOptions.myApprovalStatus = filterOptions.myApprovalStatus;
    },
    removeAsyncTask: (state) => void (state.data.asyncTaskCount -= 1),
    toggleSettingsPanel: (state) => void (state.settings.settingsPanelOpen = !state.settings.settingsPanelOpen),
    toggleSortDirection: (state) => {
      state.ui.sortDirection = state.ui.sortDirection === 'desc' ? 'asc' : 'desc';
      state.data.pullRequests = [...state.data.pullRequests].sort((a, b) => sortByCreationDate(a, b, state.ui.sortDirection));
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getPullRequests.fulfilled, (state, action) => {
      state.data.pullRequests = action.payload.sort((a, b) => sortByCreationDate(a, b, state.ui.sortDirection));
      state.data.asyncTaskCount -= 1;
    });

    builder.addCase(setFullScreenMode.fulfilled, (state, action) => void (state.ui.isFullScreenMode = action.payload));

    builder.addMatcher(isAnyOf(getPullRequests.pending, restoreSettings.pending, saveSettings.pending), (state) => {
      state.data.asyncTaskCount += 1;
    });

    builder.addMatcher(isAnyOf(restoreSettings.fulfilled, saveSettings.fulfilled), (state, action) => {
      const savedSettings = action.payload;
      state.ui.isFullScreenMode = savedSettings.isFullScreenMode ?? defaults.isFullScreenMode;
      state.ui.selectedTab = savedSettings.selectedTab ?? defaults.selectedTab;
      state.ui.sortDirection = savedSettings.sortDirection ?? defaults.sortDirection;
      state.ui.daysAgo = savedSettings.daysAgo ?? defaults.daysAgo;

      state.settings.autoRefreshDuration = savedSettings.autoRefreshDuration ?? defaults.autoRefreshDuration;
      state.settings.defaults.isFullScreenMode = savedSettings.isFullScreenMode ?? defaults.isFullScreenMode;
      state.settings.defaults.selectedTab = savedSettings.selectedTab ?? defaults.selectedTab;
      state.settings.defaults.sortDirection = savedSettings.sortDirection ?? defaults.sortDirection;
      state.settings.defaults.daysAgo = savedSettings.daysAgo ?? defaults.daysAgo;
      state.settings.defaults.isSavingFilterOptions = savedSettings.isSavingFilterOptions ?? defaults.isSavingFilterOptions;
      state.settings.defaults.selectedFilterOptions = savedSettings.selectedFilterOptions ?? defaults.selectedFilterOptions;
      state.settings.defaults.autoRefreshDuration = savedSettings.autoRefreshDuration ?? defaults.autoRefreshDuration;
      state.data.asyncTaskCount -= 1;
    });
  },
});

export const { actions } = rootSlice;
export const asyncActions = { getPullRequests, restoreSettings, setFullScreenMode, saveSettings };

export const store = configureStore({
  reducer: rootSlice.reducer,
  middleware: (getDefaultMiddleware) => {
    const isDevelopment = process.env.NODE_ENV !== 'production';
    if (isDevelopment) {
      return getDefaultMiddleware({ serializableCheck: false }).concat(createLogger({ duration: true, collapsed: true, diff: true }));
    }

    return getDefaultMiddleware({ serializableCheck: false });
  },
});
export type State = ReturnType<typeof store.getState>;
export const useAppDispatch = () => useDispatch<typeof store.dispatch>();
export const useAppSelector: TypedUseSelectorHook<State> = useSelector;
