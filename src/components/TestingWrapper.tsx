import * as React from 'react';
import { Provider } from 'react-redux';
import { Store, AnyAction } from 'redux';

export type WrapperType = { children?: React.ReactNode };

type TestingWrapperType = WrapperType & { store: Store<any, AnyAction> };
export const TestingWrapper: React.FC<TestingWrapperType> = ({ children, store }: TestingWrapperType) => {
  return <Provider store={store}>{children}</Provider>;
};
