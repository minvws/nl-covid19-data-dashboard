import { gmData, vrData } from '@corona-dashboard/common';
import { Select } from '@sanity/ui';
import FormField from 'part:@sanity/components/formfields/default';
import { withDocument } from 'part:@sanity/form-builder';
import { PatchEvent, set } from 'part:@sanity/form-builder/patch-event';
import React, { forwardRef, useMemo } from 'react';
import { isDefined } from 'ts-is-present';

export const CodeSelectInput = withDocument(
  forwardRef((props: any, ref: any) => {
    const { value, onChange, document, compareValue, type, markers } = props;

    const onChangeSelect = (event: any) => {
      const value = event.target.value;
      onChange(PatchEvent.from(set(value)));
    };

    const values = useMemo(() => {
      if (document.area === 'gm') {
        return gmData.map((x) => ({
          value: x.gemcode,
          label: x.displayName ?? x.name,
        }));
      } else if (document.area === 'vr') {
        return vrData.map((x) => ({ value: x.code, label: x.name }));
      }
      return undefined;
    }, [document.area]);

    return (
      <FormField compareValue={compareValue} label={type.title} description={type.description} markers={markers}>
        {isDefined(values) ? (
          <Select ref={ref} value={value ?? ''} onChange={onChangeSelect}>
            <option value="" disabled hidden>
              Selecteer een {document.area === 'gm' ? 'gemeente' : 'veiligheidsregio'}
            </option>
            {values.map((x) => (
              <option key={x.value} value={x.value}>
                {x.label}
              </option>
            ))}
          </Select>
        ) : null}
      </FormField>
    );
  })
);
