import React, { FormEvent, useState } from 'react';
import { withDocument } from 'part:@sanity/form-builder';
import { getTopicalTileDateConfig, ThemeTileDateConfig } from '../hooks/get-topical-tile-date-config';
import PatchEvent, { set } from '@sanity/form-builder/PatchEvent';
import { FormField, FormFieldProps } from '@sanity/base/components';
import { TextInput } from '@sanity/ui';
import { ValidationMarker } from '@sanity/types/dist/dts';

type ShowDateProps = {
  type: { title: 'Nederlands' | 'Engels' };
  markers: ValidationMarker[];
  presence: FormFieldProps['__unstable_presence'];
  value: string;
  onChange: (event: PatchEvent) => void;
  document: { themeTileDateConfig: ThemeTileDateConfig };
};

const ShowDate = (props: ShowDateProps) => {
  const {
    type,
    markers,
    presence,
    onChange,
    document: { themeTileDateConfig: dateConfig },
  } = props;
  const isConfigValid = dateConfig?.startDayOfDate >= 0 && dateConfig?.weekOffset >= 0 && dateConfig?.timeSpanInDays >= 1;
  const formattedDate = !isConfigValid ? '' : getTopicalTileDateConfig({ config: dateConfig, inputDate: new Date(), language: type.title });

  // The following line makes it possible to do realtime updates on this field with the new date configurations
  const [value, setValue] = useState(props.value);

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

export const TopicalTileDate = withDocument(ShowDate);
