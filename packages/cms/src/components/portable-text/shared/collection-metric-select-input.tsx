import { useDocumentOperation } from '@sanity/react-hooks';
import { Select } from '@sanity/ui';
import FormField from 'part:@sanity/components/formfields/default';
import { withDocument } from 'part:@sanity/form-builder';
import { PatchEvent, set, unset } from 'part:@sanity/form-builder/patch-event';
import React, { forwardRef } from 'react';
import { isDefined } from 'ts-is-present';
import { v4 as uuidv4 } from 'uuid';
import { dataStructure } from '../../../data/data-structure';

const createPatchFrom = (value: string) => {
  return PatchEvent.from(value === '' ? unset() : set(value));
};

function getDropdownValues(map: 'gm' | 'vr') {
  const collection = dataStructure[`${map}_collection`];

  return Object.keys(collection).map((x) => ({ value: x, label: x }));
}

export const CollectionMetricSelectInput = withDocument(
  forwardRef((props: any, ref: any) => {
    const { type, value, onChange, document, compareValue, markers } = props;
    const { patch } = useDocumentOperation(document._id?.replace('drafts.', '') ?? uuidv4(), document._type) as any;

    const area = document?.area;

    if (!isDefined(area)) {
      return null;
    }

    const values = getDropdownValues(area);

    const onChangeSelect = (event: any) => {
      const value = event.target.value;
      if (isDefined(document._id)) {
        patch.execute([{ unset: ['metricProperty'] }]);
      }
      onChange(createPatchFrom(value));
    };

    return (
      <FormField compareValue={compareValue} label={type.title} description={type.description} markers={markers}>
        <Select ref={ref} value={value ?? ''} onChange={onChangeSelect}>
          <option value="" disabled hidden>
            Selecteer een metriek
          </option>
          {values.map((x) => (
            <option key={x.value} value={x.value}>
              {x.label}
            </option>
          ))}
        </Select>
      </FormField>
    );
  })
);
