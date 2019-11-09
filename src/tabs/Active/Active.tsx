import * as React from "react";
import { useDispatch, useSelector } from "react-redux";

import { Card } from "azure-devops-ui/Card";
import { Spinner } from "office-ui-fabric-react";
import { FilterBar } from "azure-devops-ui/FilterBar";
import { DropdownFilterBarItem } from "azure-devops-ui/Dropdown";
import { ObservableArray } from "azure-devops-ui/Core/Observable";
import { FILTER_CHANGE_EVENT } from "azure-devops-ui/Utilities/Filter";
import { Table, ITableColumn, ColumnMore } from "azure-devops-ui/Table";
import { KeywordFilterBarItem } from "azure-devops-ui/TextFilterBarItem";
import { ConditionalChildren } from "azure-devops-ui/ConditionalChildren";
import { DropdownMultiSelection } from "azure-devops-ui/Utilities/DropdownSelection";

import "./Active.scss";

import {
  IActive,
  SEARCH_STRING,
  REPOSITORIES,
  SOURCE_BRANCH,
  TARGET_BRANCH,
  AUTHOR,
  REVIEWER,
  MY_APPROVAL_STATUS,
  ActiveItemProvider,
  FilterDictionary,
  FilterItemsDictionary
} from "./Active.types";
import { andFilter } from "../../lib/filters";
import { ActionTypes, PrHubState, PR } from "../../state/types";
import { fromPRToFilterItems } from "../../state/transformData";
import { ApprovalStatusItem } from "../../components/ApprovalStatusItem";
import { renderTitleColumn, renderReviewersColumn } from "../../components/Columns";

const pullRequestItemProvider$ = new ObservableArray<ActiveItemProvider>();
export const Active: React.FC<IActive> = ({ filter }) => {
  const { data, ui } = useSelector((store: PrHubState) => store);
  const dispatch = useDispatch();
  const [filterItems, setFilterItems] = React.useState<FilterItemsDictionary>({
    repositories: [],
    sourceBranch: [],
    targetBranch: [],
    author: [],
    reviewer: [],
    myApprovalStatus: []
  });

  const columns: ITableColumn<PR>[] = [
    {
      id: "title",
      name: "Pull Request",
      renderCell: renderTitleColumn,
      width: -100
    },
    {
      id: "reviewers",
      name: "Reviewers",
      renderCell: renderReviewersColumn,
      width: 416
    },
    new ColumnMore(data => {
      return {
        id: "sub-menu",
        items: [
          {
            id: "submenu-one",
            text: "Show Work Items",
            iconProps: { iconName: "WorkItem" },
            onActivate: () => {}
          }
        ]
      };
    })
  ];

  React.useEffect(() => {
    pullRequestItemProvider$.splice(0, pullRequestItemProvider$.length);
    pullRequestItemProvider$.push(...data.pullRequests);
    setFilterItems(fromPRToFilterItems(data.pullRequests));

    filter.subscribe(() => {
      const filterValues: FilterDictionary = {
        searchString: filter.getFilterItemValue<string>(SEARCH_STRING),
        repositories: filter.getFilterItemValue<string[]>(REPOSITORIES),
        sourceBranch: filter.getFilterItemValue<string[]>(SOURCE_BRANCH),
        targetBranch: filter.getFilterItemValue<string[]>(TARGET_BRANCH),
        author: filter.getFilterItemValue<string[]>(AUTHOR),
        reviewer: filter.getFilterItemValue<string[]>(REVIEWER),
        myApprovalStatus: filter.getFilterItemValue<string[]>(MY_APPROVAL_STATUS)
      };
      const filteredResult = andFilter(data.pullRequests, filterValues);
      pullRequestItemProvider$.splice(0, pullRequestItemProvider$.length);
      pullRequestItemProvider$.push(...filteredResult);
    }, FILTER_CHANGE_EVENT);
    return () => filter.unsubscribe(() => {}, FILTER_CHANGE_EVENT);
  }, [filter, data.pullRequests]);

  return (
    <div className="flex-column">
      <ConditionalChildren renderChildren={ui.isFilterVisible}>
        <div className={"margin-bottom-16"}>
          <FilterBar filter={filter} onDismissClicked={() => dispatch({ type: ActionTypes.TOGGLE_FILTER_BAR })}>
            <KeywordFilterBarItem
              filterItemKey={SEARCH_STRING}
              placeholder={"Search Across Pull Requests"}
              filter={filter}
            />
            <DropdownFilterBarItem
              filterItemKey={REPOSITORIES}
              placeholder={"Repositories"}
              filter={filter}
              selection={new DropdownMultiSelection()}
              showFilterBox={true}
              items={filterItems.repositories}
            />
            <DropdownFilterBarItem
              filterItemKey={SOURCE_BRANCH}
              placeholder={"Source Branch"}
              filter={filter}
              selection={new DropdownMultiSelection()}
              showFilterBox={true}
              items={filterItems.sourceBranch}
            />
            <DropdownFilterBarItem
              filterItemKey={TARGET_BRANCH}
              placeholder={"Target Branch"}
              filter={filter}
              selection={new DropdownMultiSelection()}
              showFilterBox={true}
              items={filterItems.targetBranch}
            />
            <DropdownFilterBarItem
              filterItemKey={AUTHOR}
              placeholder={"Author"}
              filter={filter}
              selection={new DropdownMultiSelection()}
              showFilterBox={true}
              items={filterItems.author}
            />
            <DropdownFilterBarItem
              filterItemKey={REVIEWER}
              placeholder={"Reviewer"}
              filter={filter}
              selection={new DropdownMultiSelection()}
              showFilterBox={true}
              items={filterItems.reviewer}
            />
            <DropdownFilterBarItem
              filterItemKey={MY_APPROVAL_STATUS}
              placeholder={"My Approval Status"}
              filter={filter}
              selection={new DropdownMultiSelection()}
              renderItem={ApprovalStatusItem}
              showFilterBox={true}
              items={filterItems.myApprovalStatus}
            />
          </FilterBar>
        </div>
      </ConditionalChildren>
      {data.asyncTaskCount === 0 ? (
        <Card className="flex-grow bolt-table-card" contentProps={{ contentPadding: false }}>
          <Table<PR> columns={columns} itemProvider={pullRequestItemProvider$} showLines={true} role="table" />
        </Card>
      ) : (
        <Spinner label="fetching pull requests..." size={3} className="center-spinner" />
      )}
    </div>
  );
};
