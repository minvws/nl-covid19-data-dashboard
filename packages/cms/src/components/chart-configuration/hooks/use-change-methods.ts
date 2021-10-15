import {
  DataOptionsConfiguration,
  PartialChartConfiguration,
} from '@corona-dashboard/common';
import { PatchEvent, set } from 'part:@sanity/form-builder/patch-event';
import { useCallback } from 'react';
import { isDefined } from 'ts-is-present';

export function useChangeMethods(
  onChange: (patchEvent: PatchEvent) => void,
  configuration: PartialChartConfiguration
) {
  const onChangeProp = (
    propertyName: keyof PartialChartConfiguration,
    reset: (keyof PartialChartConfiguration)[] = [],
    explicitValue?: any
  ) => {
    return (event: any) => {
      changeProp(propertyName, reset, explicitValue ?? event.target.value);
    };
  };

  const changeProp = useCallback(
    (
      propertyName: keyof PartialChartConfiguration,
      reset: (keyof PartialChartConfiguration)[] = [],
      newValue: any
    ) => {
      if (
        !isDefined(configuration) ||
        configuration[propertyName] === newValue
      ) {
        return;
      }
      const newConfiguration = {
        ...configuration,
        [propertyName]: newValue,
      };
      reset.forEach((x) => (newConfiguration[x] = undefined));
      onChange(PatchEvent.from(set(JSON.stringify(newConfiguration))));
    },
    [onChange, configuration]
  );

  const onChangeDataOptionProp = (
    propertyName: keyof DataOptionsConfiguration,
    reset: (keyof DataOptionsConfiguration)[] = [],
    explicitValue?: any
  ) => {
    return (event: any) => {
      changeDataOptionProp(
        propertyName,
        reset,
        explicitValue ?? event.target.value
      );
    };
  };

  const changeDataOptionProp = useCallback(
    (
      propertyName: keyof DataOptionsConfiguration,
      reset: (keyof DataOptionsConfiguration)[] = [],
      newValue: any
    ) => {
      if (!isDefined(configuration.dataOptions)) {
        configuration.dataOptions = {};
      }
      if (configuration.dataOptions[propertyName] === newValue) {
        return;
      }
      const newConfiguration = {
        ...configuration,
        dataOptions: {
          ...configuration.dataOptions,
          [propertyName]: newValue,
        },
      };
      reset.forEach((x) => (newConfiguration.dataOptions[x] = undefined));
      onChange(PatchEvent.from(set(JSON.stringify(newConfiguration))));
    },
    [onChange, configuration]
  );

  return [
    onChangeProp,
    changeProp,
    onChangeDataOptionProp,
    changeDataOptionProp,
  ] as const;
}
