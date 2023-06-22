import { Select } from '@sanity/ui';
import FormField from 'part:@sanity/components/formfields/default';
import { withDocument } from 'part:@sanity/form-builder';
import { PatchEvent, set } from 'part:@sanity/form-builder/patch-event';
import React, { forwardRef, useMemo } from 'react';
import { isDefined } from 'ts-is-present';
import { dataStructure } from '../../../data/data-structure';

export const MetricSelectInput = withDocument(
  forwardRef((props: any, ref: any) => {
    const { value, onChange, document, compareValue, type, markers } = props;

    const metricNames = useMemo(() => {
      const areas = document.area ? (dataStructure as any)[document.area] : undefined;
      return areas ? Object.keys(areas) : undefined;
    }, [document.area]);

    const onChangeSelect = (event: any) => {
      onChange(PatchEvent.from(set(event.target.value)));
    };

    return (
      <>
        {
          <FormField compareValue={compareValue} label={type.title} description={type.description} markers={markers}>
            {isDefined(metricNames) ? (
              <Select ref={ref} value={value ?? ''} onChange={onChangeSelect}>
                <option value="" disabled hidden>
                  Selecteer een metriek naam
                </option>
                {metricNames.map((x) => (
                  <option key={x} value={x}>
                    {x}
                  </option>
                ))}
              </Select>
            ) : null}
          </FormField>
        }
      </>
    );
  })
);
