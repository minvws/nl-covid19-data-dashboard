import React, { useState } from 'react';
import { withDocument } from 'part:@sanity/form-builder';
import { getTopicalTileDateConfig } from '../hooks/get-topical-tile-date-config';
import PatchEvent, { set } from '@sanity/form-builder/PatchEvent';
import { FormField } from '@sanity/base/components';
import { TextInput } from '@sanity/ui';

const ShowDate = (props: any) => {
  const {
    type,
    markers,
    presence,
    onChange,
    document: { themeTileDateConfig: dateConfig },
  } = props;
  const isConfigValid = dateConfig?.startDayOfDate >= 0 && dateConfig?.weekOffset >= 0 && dateConfig?.timeSpanInDays >= 1;
  const formattedDate = !isConfigValid ? '' : getTopicalTileDateConfig({ config: dateConfig, inputDate: new Date(), language: type.title });

  const initFormattedDateValue = set(formattedDate);
  onChange(PatchEvent.from(initFormattedDateValue));
  const [value, setValue] = useState('');

  const handleChange = (event: any) => {
    const inputValue = event.target.value;
    const newValue = inputValue === '' ? formattedDate : inputValue;
    const patchEventValue = set(newValue);
    setValue(newValue);
    onChange(PatchEvent.from(patchEventValue));
  };

  return (
    <FormField description={`Het resultaat van de tegeldatum-configuratie is: ${formattedDate}`} title={type.title} __unstable_markers={markers} __unstable_presence={presence}>
      <TextInput onChange={handleChange} value={value === '' ? formattedDate : value} />
    </FormField>
  );
};

export const TopicalTileDate = withDocument(ShowDate);
