import React, { useState } from 'react';
import { withDocument } from 'part:@sanity/form-builder';
import { getTopicalTileDateConfig } from '../hooks/get-topical-tile-date-config';
import { FormField } from '@sanity/base/components';
import { TextInput } from '@sanity/ui';

const ShowDate = (props: any) => {
  const dateConfig = props.document.themeTileDateConfig;
  const formattedDate = !(dateConfig?.isoWeekOffset && dateConfig?.startDayOfDate && dateConfig?.timeSpanInDays)
    ? ''
    : getTopicalTileDateConfig({ config: dateConfig, inputDate: new Date() });
  const [value, setValue] = useState(formattedDate);

  const { type, markers, presence } = props;

  const handleChange = (event: any) => {
    const inputValue = event.currentTarget.value;
    setValue(inputValue === '' ? formattedDate : inputValue);
  };

  return (
    <FormField description={formattedDate} title={type.title} __unstable_markers={markers} __unstable_presence={presence}>
      <TextInput onChange={handleChange} value={value} />
    </FormField>
  );
};

export const TopicalTileDate = withDocument(ShowDate);
