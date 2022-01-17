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
import { defaultFilterOptions, defaults } from './transformData';
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

const getCompletedPullRequests = createAsyncThunk('root/getCompletedPullRequests', async (_, thunkAPI) => {
  try {
    const repos = await getRepositories();
    const allCompletedPrs = await Promise.all(repos.flatMap((repo) => fetchPullRequests(repo, criteria(PullRequestStatus.Completed), 25)));
    return allCompletedPrs.reduce((prev, curr) => [...prev, ...curr], []);
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

    return setSettings(defaults());
  } catch {
    await displayErrorMessage();
    return thunkAPI.rejectWithValue(defaults());
  }
});

const saveSettings = createAsyncThunk('root/saveSettings', async (defaultSettings: DefaultSettings) => {
  return setSettings(defaultSettings);
});

const setFullScreenMode = createAsyncThunk('root/setFullScreenMode', async (isFullScreenMode: boolean) => {
  return setFullScreenModeState(isFullScreenMode);
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
    setSelectedTab: (state, action: PayloadAction<TabOptions>) => {
      state.ui.selectedTab = action.payload;
      state.data.filterOptions = defaultFilterOptions();
    },
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
    toggleSettingsPanel: (state) => void (state.settings.settingsPanelOpen = !state.settings.settingsPanelOpen),
    toggleSortDirection: (state) => {
      state.ui.sortDirection = state.ui.sortDirection === 'desc' ? 'asc' : 'desc';
      state.data.pullRequests = [...state.data.pullRequests].sort((a, b) => sortByCreationDate(a, b, state.ui.sortDirection));
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getPullRequests.fulfilled, (state, action) => {
      state.data.pullRequests = action.payload.sort((a, b) => sortByCreationDate(a, b, state.ui.sortDirection));
      state.data.requestLoading.getPullRequests = 'fulfilled';
    });

    builder.addCase(getCompletedPullRequests.fulfilled, (state, action) => {
      const activePullRequests = state.data.pullRequests.filter(({ isActive }) => isActive);
      const completedPullRequests = action.payload.sort((a, b) => sortByCreationDate(a, b, state.ui.sortDirection));
      state.data.pullRequests = [...activePullRequests, ...completedPullRequests];
      state.data.requestLoading.getCompletedPullRequests = 'fulfilled';
    });

    builder.addCase(setFullScreenMode.fulfilled, (state, action) => void (state.ui.isFullScreenMode = action.payload));

    builder.addMatcher(
      isAnyOf(getPullRequests.pending, getCompletedPullRequests.pending, restoreSettings.pending, saveSettings.pending),
      (state, action) => {
        if (`${getPullRequests.typePrefix}/${action.meta.requestStatus}` === action.type) {
          state.data.requestLoading.getPullRequests = 'loading';
        }

        if (`${getCompletedPullRequests.typePrefix}/${action.meta.requestStatus}` === action.type) {
          state.data.requestLoading.getCompletedPullRequests = 'loading';
        }

        if (`${restoreSettings.typePrefix}/${action.meta.requestStatus}` === action.type) {
          state.data.requestLoading.restoreSettings = 'loading';
        }

        if (`${saveSettings.typePrefix}/${action.meta.requestStatus}` === action.type) {
          state.data.requestLoading.saveSettings = 'loading';
        }
      }
    );

    builder.addMatcher(
      isAnyOf(getPullRequests.rejected, getCompletedPullRequests.rejected, restoreSettings.rejected, saveSettings.rejected),
      (state, action) => {
        if (`${getPullRequests.typePrefix}/${action.meta.requestStatus}` === action.type) {
          state.data.requestLoading.getPullRequests = 'rejected';
        }

        if (`${getCompletedPullRequests.typePrefix}/${action.meta.requestStatus}` === action.type) {
          state.data.requestLoading.getCompletedPullRequests = 'rejected';
        }

        if (`${restoreSettings.typePrefix}/${action.meta.requestStatus}` === action.type) {
          state.data.requestLoading.restoreSettings = 'rejected';
        }

        if (`${saveSettings.typePrefix}/${action.meta.requestStatus}` === action.type) {
          state.data.requestLoading.saveSettings = 'rejected';
        }

        console.error(`${action.type}: did not complete successfully`);
      }
    );

    builder.addMatcher(isAnyOf(restoreSettings.fulfilled, saveSettings.fulfilled), (state, action) => {
      const savedSettings = action.payload;
      state.ui.isFullScreenMode = savedSettings?.isFullScreenMode ?? defaults().isFullScreenMode;
      state.ui.selectedTab = savedSettings?.selectedTab ?? defaults().selectedTab;
      state.ui.sortDirection = savedSettings?.sortDirection ?? defaults().sortDirection;
      state.ui.daysAgo = savedSettings?.daysAgo ?? defaults().daysAgo;

      state.settings.autoRefreshDuration = savedSettings?.autoRefreshDuration ?? defaults().autoRefreshDuration;
      state.settings.defaults.isFullScreenMode = savedSettings?.isFullScreenMode ?? defaults().isFullScreenMode;
      state.settings.defaults.selectedTab = savedSettings?.selectedTab ?? defaults().selectedTab;
      state.settings.defaults.sortDirection = savedSettings?.sortDirection ?? defaults().sortDirection;
      state.settings.defaults.daysAgo = savedSettings?.daysAgo ?? defaults().daysAgo;
      state.settings.defaults.isSavingFilterOptions = savedSettings?.isSavingFilterOptions ?? defaults().isSavingFilterOptions;
      state.settings.defaults.selectedFilterOptions = savedSettings?.selectedFilterOptions ?? defaults().selectedFilterOptions;
      state.settings.defaults.autoRefreshDuration = savedSettings?.autoRefreshDuration ?? defaults().autoRefreshDuration;

      if (`${restoreSettings.typePrefix}/${action.meta.requestStatus}` === action.type) {
        state.data.requestLoading.restoreSettings = 'fulfilled';
      }

      if (`${saveSettings.typePrefix}/${action.meta.requestStatus}` === action.type) {
        state.data.requestLoading.saveSettings = 'fulfilled';
      }
    });
  },
});

export const { actions } = rootSlice;
export const asyncActions = { getPullRequests, getCompletedPullRequests, restoreSettings, setFullScreenMode, saveSettings };

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
