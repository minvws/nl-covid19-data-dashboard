import { Flex, Label, Radio, Stack, TextInput } from '@sanity/ui';
import FormField from 'part:@sanity/components/formfields/default';
import { withDocument } from 'part:@sanity/form-builder';
import { PatchEvent, set, unset } from 'part:@sanity/form-builder/patch-event';
import React, { forwardRef } from 'react';
import { isDefined } from 'ts-is-present';

function hasTypeWithCurve() {
  return true; // type === 'line' || type === 'gapped-line';
}

export const LineStyleInput = withDocument(
  forwardRef((props: any, ref: any) => {
    const { value, onChange, compareValue, type, markers } = props;

    const onChangeProp = (event: any) => {
      const setValue = event.target.value === 'none' ? unset() : set(event.target.value);
      onChange(PatchEvent.from(setValue));
    };

    return (
      <>
        <TextInput ref={ref} style={{ display: 'none' }} value={value ?? ''} />
        {hasTypeWithCurve() ? (
          <FormField compareValue={compareValue} label={type.title} description={type.description} markers={markers}>
            <Stack space={2}>
              <Flex style={{ alignItems: 'center', gap: 10 }}>
                <Radio checked={value === 'linear'} name="curve" value="linear" onChange={onChangeProp} />
                <Label>Linear</Label>
              </Flex>
              <Flex style={{ alignItems: 'center', gap: 10 }}>
                <Radio checked={value === 'step'} name="curve" value="step" onChange={onChangeProp} />
                <Label>Step</Label>
              </Flex>
              <Flex style={{ alignItems: 'center', gap: 10 }}>
                <Radio checked={!isDefined(value)} name="curve" value="none" onChange={onChangeProp} />
                <Label>None</Label>
              </Flex>
            </Stack>
          </FormField>
        ) : null}
      </>
    );
  })
);
