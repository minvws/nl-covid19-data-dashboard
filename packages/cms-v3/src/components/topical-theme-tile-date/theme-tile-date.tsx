import React, { FormEvent, useState } from 'react';
import { ThemeTileDateConfig, getTileDateConfig } from './logic/get-tile-date-config';
import { FormFieldProps, PatchEvent, ValidationMarker } from 'sanity';

// import { withDocument } from 'part:@sanity/form-builder';
// import { getTopicalTileDateConfig, ThemeTileDateConfig } from '../hooks/get-topical-tile-date-config';
// import PatchEvent, { set } from '@sanity/form-builder/PatchEvent';
// import { FormField, FormFieldProps } from '@sanity/base/components';
// import { TextInput } from '@sanity/ui';
// import { ValidationMarker } from '@sanity/types/dist/dts';

interface ThemeTileDateProps {
  type: { title: 'Nederlands' | 'Engels' };
  markers: ValidationMarker[];
  presence: FormFieldProps['__unstable_presence'];
  value: string;
  onChange: (event: PatchEvent) => void;
  document: { themeTileDateConfig: ThemeTileDateConfig };
}

const ThemeTileDate = ({ value: dateValue, type, markers, presence, onChange, document: { themeTileDateConfig } }: ThemeTileDateProps) => {
  const isConfigValid = themeTileDateConfig?.startDayOfDate >= 0 && themeTileDateConfig?.weekOffset >= 0 && themeTileDateConfig?.timeSpanInDays >= 1;
  const formattedDate = !isConfigValid ? '' : getTileDateConfig({ config: themeTileDateConfig, inputDate: new Date(), language: type.title });

  // The following line makes it possible to do realtime updates on this field with the new date configurations
  const [value, setValue] = useState(dateValue);

  const handleChange = (event: FormEvent<HTMLInputElement>) => {
    const inputValue = event.currentTarget.value;
    const newValue = inputValue === '' ? formattedDate : inputValue;
    const patchEventValue = set(newValue);
    setValue(newValue);
    onChange(PatchEvent.from(patchEventValue));
  };

  return (
    <FormField description={`Het resultaat van de tegeldatum-configuratie is: ${formattedDate}.`} title={type.title} __unstable_markers={markers} __unstable_presence={presence}>
      <TextInput onChange={handleChange} value={value === '' ? formattedDate : value} />
    </FormField>
  );
};

export const TopicalTileDate = withDocument(ThemeTileDate);
