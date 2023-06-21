import { Select } from '@sanity/ui';
import FormField from 'part:@sanity/components/formfields/default';
import { withDocument } from 'part:@sanity/form-builder';
import { PatchEvent, set, unset } from 'part:@sanity/form-builder/patch-event';
import React, { forwardRef } from 'react';
import { isDefined } from 'ts-is-present';
import { dataStructure } from '../../../data/data-structure';

const createPatchFrom = (value: string) => {
  return PatchEvent.from(value === '' ? unset() : set(value));
};

function getDropdownValues(map: 'gm' | 'vr', metricName: string) {
  const collection = dataStructure[`${map}_collection`];

  return (collection as any)?.[metricName].map((x: string) => ({
    value: x,
    label: x,
  }));
}

export const CollectionMetricPropertySelectInput = withDocument(
  forwardRef((props: any, ref: any) => {
    const { type, value, onChange, document, compareValue, markers } = props;

    const area = document?.area;
    const metricName = document?.metricName;

    if (!isDefined(area) || !isDefined(metricName)) {
      return null;
    }

    const values = getDropdownValues(area, metricName);

    const onChangeSelect = (event: any) => {
      const value = event.target.value;
      onChange(createPatchFrom(value));
    };

    return (
      <FormField compareValue={compareValue} label={type.title} description={type.description} markers={markers}>
        <Select ref={ref} value={value ?? ''} onChange={onChangeSelect}>
          <option value="" disabled hidden>
            Selecteer een metriek waarde
          </option>
          {values.map((x: { value: string; label: string }) => (
            <option key={x.value} value={x.value}>
              {x.label}
            </option>
          ))}
        </Select>
      </FormField>
    );
  })
);
