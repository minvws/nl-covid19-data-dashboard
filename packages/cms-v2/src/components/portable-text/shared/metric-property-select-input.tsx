import { Select } from '@sanity/ui';
import FormField from 'part:@sanity/components/formfields/default';
import { withDocument } from 'part:@sanity/form-builder';
import { PatchEvent, set } from 'part:@sanity/form-builder/patch-event';
import React, { forwardRef, useMemo } from 'react';
import { isDefined } from 'ts-is-present';
import { dataStructure } from '../../../data/data-structure';

export const MetricPropertySelectInput = withDocument(
  forwardRef((props: any, ref: any) => {
    const { type, value, onChange, document, compareValue, markers } = props;

    const metricProperties = useMemo(
      () => (document.area && document.metricName ? ((dataStructure as any)[document.area][document.metricName] as string[]) : undefined),
      [document.area, document.metricName]
    );

    const onChangeSelect = (event: any) => {
      onChange(PatchEvent.from(set(event.target.value)));
    };

    return (
      <>
        {isDefined(metricProperties) ? (
          <FormField label={type.title} description={type.description} compareValue={compareValue} markers={markers}>
            <Select ref={ref} value={value ?? ''} onChange={onChangeSelect}>
              <option value="" disabled hidden>
                Selecteer een metriek waarde
              </option>
              {metricProperties.map((x) => (
                <option key={x} value={x}>
                  {x}
                </option>
              ))}
            </Select>
          </FormField>
        ) : null}
      </>
    );
  })
);
