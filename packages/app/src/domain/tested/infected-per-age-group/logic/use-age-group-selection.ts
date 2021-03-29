import { useState } from 'react';

export function useAgeGroupSelection() {
  const [ageGroupSelection, setAgeGroupSelection] = useState<string[]>([]);

  function resetAgeGroupSelection() {
    setAgeGroupSelection([]);
  }

  function toggleAgeGroup(ageGroupRange: string) {
    if (ageGroupSelection.includes(ageGroupRange)) {
      removeAgeGroup(ageGroupRange);
    } else {
      addAgeGroup(ageGroupRange);
    }
  }

  function removeAgeGroup(ageGroupRange: string) {
    setAgeGroupSelection((prev) => {
      return prev.filter((item) => item !== ageGroupRange);
    });
  }

  function addAgeGroup(ageGroupRange: string) {
    setAgeGroupSelection((prev) => {
      return [ageGroupRange, ...prev];
    });
  }

  return {
    ageGroupSelection,
    resetAgeGroupSelection,
    toggleAgeGroup,
  };
}
