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

export const areaTitles = {
  nl: 'Nationaal',
  vr: 'Veiligheidsregio',
  gm: 'Gemeente',
};

const areaValues = Object.keys(dataStructure)
  .filter((x) => !x.endsWith('_collection'))
  .map((x) => ({
    value: x,
    label: areaTitles[x as keyof typeof areaTitles],
  }));

export const AreaSelectInput = withDocument(
  forwardRef((props: any, ref: any) => {
    const { value, onChange, document, compareValue, type, markers } = props;
    const { patch } = useDocumentOperation(document._id?.replace('drafts.', '') ?? uuidv4(), document._type) as any;

    const onChangeSelect = (event: any) => {
      const value = event.target.value;
      if (isDefined(document._id)) {
        patch.execute([{ unset: ['metricName', 'metricProperties'] }]);
      }
      onChange(createPatchFrom(value));
    };

    return (
      <FormField compareValue={compareValue} label={type.title} description={type.description} markers={markers}>
        <Select ref={ref} value={value ?? ''} onChange={onChangeSelect}>
          <option value="" disabled hidden>
            Selecteer een gebied
          </option>
          {areaValues.map((x) => (
            <option key={x.value} value={x.value}>
              {x.label}
            </option>
          ))}
        </Select>
      </FormField>
    );
  })
);
