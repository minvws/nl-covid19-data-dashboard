import { colors } from '@corona-dashboard/common';
import { Stack, Text, TextArea, TextInput } from '@sanity/ui';
import { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { BsCheckCircle, BsExclamationCircle } from 'react-icons/bs';
import { StringInputProps, set, unset } from 'sanity';
import styled from 'styled-components';

export const StringInput = (props: StringInputProps & { multiline?: boolean }) => {
  const { onChange, value = '', elementProps, validation, multiline = false } = props;
  const [hasValidationError, setHasValidationError] = useState(validation.length > 0);

  useEffect(() => {
    setHasValidationError(validation.length > 0);
  }, [validation]);

  const handleValidation = useCallback(() => {
    setHasValidationError(validation.length > 0);
  }, [validation]);

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      onChange(event.currentTarget.value ? set(event.currentTarget.value) : unset());
      handleValidation();
    },
    [onChange, handleValidation]
  );

  const inlineErrorStyles = { border: `2px solid ${hasValidationError ? colors.red2 : 'transparent'}` };

  return (
    <Stack space={3}>
      <TextInputContainer multiline={multiline}>
        {multiline ? (
          <TextArea {...elementProps} onChange={(event: ChangeEvent<HTMLTextAreaElement>) => handleChange(event)} value={value} style={inlineErrorStyles} rows={10} />
        ) : (
          <TextInput {...elementProps} onChange={(event: ChangeEvent<HTMLInputElement>) => handleChange(event)} value={value} style={inlineErrorStyles} />
        )}

        {hasValidationError ? <BsExclamationCircle color={colors.red2} /> : <BsCheckCircle color={colors.green1} />}
      </TextInputContainer>

      <Text size={1}>
        <strong>Characters:</strong> {value.length}
      </Text>
    </Stack>
  );
};

export const TextAreaInput = (props: StringInputProps) => <StringInput multiline {...props} />;

interface TextInputContainerProps {
  multiline: boolean;
}

const TextInputContainer = styled.div<TextInputContainerProps>`
  position: relative;

  input,
  textarea {
    padding-right: 35px;
  }

  svg {
    position: absolute;
    right: 4px;
    top: ${({ multiline }) => (multiline ? '10%' : '50%')};
    transform: translate(-50%, -50%);
  }
`;
