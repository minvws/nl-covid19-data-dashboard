import { createContext, useContext, ReactNode } from 'react';

type ProviderProps = {
  features: Array<string>;
  children: ReactNode;
};

export const FeatureFlagsContext = createContext<Array<string> | undefined>(
  undefined
);

export function FeatureProvider({ features = [], children }: ProviderProps) {
  if (features === null || typeof features !== 'object') {
    throw new TypeError('The features prop must be an array of strings');
  }
  return (
    <FeatureFlagsContext.Provider value={features}>
      {children}
    </FeatureFlagsContext.Provider>
  );
}

// Custom Hook API
export function useFeature(name: string) {
  const features = useContext(FeatureFlagsContext);
  if (features === null || features === undefined) {
    throw new Error('You must wrap your components in a FeatureProvider.');
  }
  return features.includes(name);
}
