import React from 'react';

import { TextInput, Stack, Label } from '@sanity/ui';

type ValidatedInputProps = {
  type: any;
  value: any;
  readOnly: boolean;
  placeholder: string;
  markers: any;
  presence: any;
  compareValue: any;
  onFocus: any;
  onBlur: any;
};

export const ValidatedInput = React.forwardRef(
  (props: ValidatedInputProps, ref: React.Ref<HTMLInputElement>) => {
    console.log(props);
    return (
      <Stack space={2}>
        <Label>{props.type.title}</Label>
        <TextInput ref={ref} value={props.value} />
      </Stack>
    );
  }
);

export default ValidatedInput;
