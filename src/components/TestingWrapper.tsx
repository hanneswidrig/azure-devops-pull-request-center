import React from 'react';
import { Store } from 'redux';
import { Provider } from 'react-redux';

export type WrapperType = { children?: React.ReactNode };
export type TestingWrapperType = WrapperType & { store: Store };
export const TestingWrapper = ({ children, store }: TestingWrapperType) => {
  return <Provider store={store}>{children}</Provider>;
};
