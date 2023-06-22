import React from 'react';
import { FormField, FormFieldProps } from '@sanity/base/components';
import { TextArea, TextInput } from '@sanity/ui';
import PatchEvent, { set, unset } from '@sanity/form-builder/PatchEvent';
import { Marker } from '@sanity/types';
import styled, { css } from 'styled-components';
import { BlockEditor } from 'part:@sanity/form-builder';

type ValidatedInputProps = {
  type: {
    description: string;
    title: string;
  };
  value: string;
  readOnly?: boolean;
  placeholder?: string;
  markers: Marker[];
  presence: FormFieldProps['__unstable_presence'];
  multiline?: boolean;
  onFocus: () => void;
  onBlur: () => void;
  onChange: (evt: PatchEvent) => void;
};

const errorStyles = css`
  background-color: #f7e8e7;
  border: 1px solid #9f3430;
`;

const StyledText = styled(TextInput)<{ hasError: boolean }>`
  ${(props) => props.hasError && errorStyles};
`;

const StyledTextArea = styled(TextArea)<{ hasError: boolean }>`
  ${(props) => props.hasError && errorStyles};
`;

const Markers = styled.div`
  margin-top: 10px;
  color: #9f3430;
`;

export const ValidatedTextArea = (props: ValidatedInputProps) => <ValidatedInput {...props} multiline />;

export const ValidatedInput = React.forwardRef((props: ValidatedInputProps, ref: React.Ref<HTMLInputElement>) => {
  const { type, value, readOnly, placeholder, markers, presence, multiline, onFocus, onBlur, onChange } = props;

  const handleChange = React.useCallback(
    (event) => {
      const inputValue = event.currentTarget.value;
      onChange(PatchEvent.from(inputValue ? set(inputValue) : unset()));
    },
    [onChange]
  );

  return (
    <FormField description={type.description} title={type.title} __unstable_markers={markers} __unstable_presence={presence}>
      {multiline ? (
        <StyledTextArea
          value={value}
          readOnly={readOnly}
          placeholder={placeholder}
          onFocus={onFocus}
          onBlur={onBlur}
          onChange={handleChange}
          hasError={!!markers.length}
          border
          rows={10}
        />
      ) : (
        <StyledText
          value={value}
          readOnly={readOnly}
          placeholder={placeholder}
          onFocus={onFocus}
          onBlur={onBlur}
          onChange={handleChange}
          ref={ref}
          hasError={!!markers.length}
          border
        />
      )}

      {markers.length ? (
        <Markers>
          {markers.map((marker) => (
            <div key={marker.item.message}>
              <strong>{marker.item.message}</strong>
            </div>
          ))}
        </Markers>
      ) : null}
    </FormField>
  );
});

export const ValidatedRichText = (props: Partial<{ markers: Marker[] }>) => {
  const { markers } = props;

  return (
    <div>
      <BlockEditor {...props} />

      {markers?.length ? (
        <Markers>
          {markers.map((marker, index) => (
            <div key={index}>
              <strong>{marker.item.message}</strong>
            </div>
          ))}
        </Markers>
      ) : null}
    </div>
  );
};

export default ValidatedInput;
