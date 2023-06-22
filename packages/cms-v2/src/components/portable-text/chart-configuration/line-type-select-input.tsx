//import { useDocumentOperation } from '@sanity/react-hooks';
import { Select } from '@sanity/ui';
import FormField from 'part:@sanity/components/formfields/default';
import { withDocument } from 'part:@sanity/form-builder';
import { PatchEvent, set, unset } from 'part:@sanity/form-builder/patch-event';
import React, { forwardRef } from 'react';

const createPatchFrom = (value: string) => {
  return PatchEvent.from(value === '' ? unset() : set(value));
};

const lineTypes = ['line', 'gapped-line', 'area', 'bar', 'range', 'stacked-area', 'gapped-stacked-area', 'gapped-area', 'invisible'];

export const LineTypeSelectInput = withDocument(
  forwardRef((props: any, ref: any) => {
    const { value, onChange, compareValue, type, markers } = props;
    /*const { patch } = useDocumentOperation(
      document._id.replace('drafts.', ''),
      document._type
    ) as any;*/

    const onChangeSelect = (event: any) => {
      const value = event.target.value;
      /*if (value !== 'line' && value !== 'gapped-line') {
        patch.execute([{ unset: ['curve'] }]);
      }*/
      onChange(createPatchFrom(value));
    };

    return (
      <FormField compareValue={compareValue} label={type.title} description={type.description} markers={markers}>
        <Select ref={ref} value={value ?? ''} onChange={onChangeSelect}>
          <option value="" disabled hidden>
            Selecteer een lijn type
          </option>
          {lineTypes.map((x) => (
            <option key={x} value={x}>
              {x}
            </option>
          ))}
        </Select>
      </FormField>
    );
  })
);
