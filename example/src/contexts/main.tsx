import {
  createContext,
  useContext,
  useState,
  type Context,
  type PropsWithChildren,
} from 'react';

import type { IteratorProvider } from '../../../src/common-deprecated/provider/iterator';

const Context = createContext({} as Record<string, any>);

interface MainContextProps extends PropsWithChildren {}

export function MainContext({ children }: MainContextProps) {
  const [iteratorCanisterProvider, setIteratorCanisterProvider] =
    useState<IteratorProvider | null>(null);

  return (
    <Context.Provider
      value={{ iteratorCanisterProvider, setIteratorCanisterProvider }}
    >
      {children}
    </Context.Provider>
  );
}

export const useMainContext = () => useContext(Context);
