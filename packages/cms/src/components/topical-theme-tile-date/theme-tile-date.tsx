import React, { useCallback, useState } from 'react';
import { ThemeTileDateConfig, getTileDateConfig } from './logic/get-tile-date-config';
import { StringInputProps, set, useFormValue } from 'sanity';
import { TextInput } from '@sanity/ui';

export const ThemeTileDate = (props: StringInputProps) => {
  const { value: dateValue, schemaType, onChange, elementProps } = props;
  const themeTileDateConfig = useFormValue(['themeTileDateConfig']) as ThemeTileDateConfig;

  const isConfigValid = themeTileDateConfig?.startDayOfDate >= 0 && themeTileDateConfig?.weekOffset >= 0 && themeTileDateConfig?.timeSpanInDays >= 1;
  const formattedDate = !isConfigValid
    ? ''
    : getTileDateConfig({ config: themeTileDateConfig, inputDate: new Date(), language: schemaType.title === 'Engels' ? 'Engels' : 'Nederlands' });

  const [value, setValue] = useState(dateValue);

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = event.currentTarget.value;
      const newValue = inputValue === '' ? formattedDate : inputValue;
      setValue(newValue);

      onChange(set(newValue));
    },
    [onChange]
  );

  return <TextInput {...elementProps} onChange={handleChange} value={value === '' ? formattedDate : value} />;
};
