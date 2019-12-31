import * as React from 'react';
import { Provider } from 'react-redux';
import { Store, AnyAction } from 'redux';

type TestingWrapperType = { children?: React.ReactNode; store: Store<any, AnyAction> };
export const TestingWrapper: React.FC<TestingWrapperType> = ({ children, store }: TestingWrapperType) => {
  return <Provider store={store}>{children}</Provider>;
};
