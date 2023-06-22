import { getReverseRouter } from '@corona-dashboard/common';
import { Select } from '@sanity/ui';
import { flatten } from 'flat';
import FormField from 'part:@sanity/components/formfields/default';
import { PatchEvent, set, unset } from 'part:@sanity/form-builder/patch-event';
import React, { forwardRef } from 'react';

export const ReverseRouterInput = forwardRef((props: any, ref: any) => {
  const { value, onChange, compareValue, type, markers } = props;

  const router = getReverseRouter(false);
  const reverseRouterPaths = Object.keys(flatten(router));

  const createPatchFrom = (value: string) => {
    return PatchEvent.from(value === '' ? unset() : set(value));
  };

  const onChangeSelect = (event: any) => {
    const value = event.target.value;
    onChange(createPatchFrom(value));
  };

  return (
    <FormField compareValue={compareValue} label={type.title} description={type.description} markers={markers}>
      <Select ref={ref} value={value ?? ''} onChange={onChangeSelect}>
        <option value="" disabled hidden>
          Selecteer een route
        </option>
        {reverseRouterPaths.map((x) => (
          <option key={x} value={x}>
            {x}
          </option>
        ))}
      </Select>
    </FormField>
  );
});
