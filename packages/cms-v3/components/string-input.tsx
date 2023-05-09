import { colors } from '@corona-dashboard/common';
import { Stack, Text, TextInput } from '@sanity/ui';
import { useCallback, useEffect, useState } from 'react';
import { BsCheckCircle, BsExclamationCircle } from 'react-icons/bs';
import { StringInputProps, set, unset } from 'sanity';
import styled from 'styled-components';

export const StringInput = (props: StringInputProps) => {
  const { onChange, value = '', elementProps, validation } = props;
  const [hasValidationError, setHasValidationError] = useState(validation.length > 0);

  useEffect(() => {
    setHasValidationError(validation.length > 0);
  }, [validation]);

  const handleValidation = useCallback(() => {
    setHasValidationError(validation.length > 0);
  }, [validation]);

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onChange(event.currentTarget.value ? set(event.currentTarget.value) : unset());
      handleValidation();
    },
    [onChange, handleValidation]
  );

  return (
    <Stack space={3}>
      <TextInputContainer>
        <TextInput {...elementProps} onChange={handleChange} value={value} style={{ border: `2px solid ${hasValidationError ? 'red' : 'transparent'}` }} />

        {hasValidationError ? <BsExclamationCircle color={colors.red3} /> : <BsCheckCircle color={colors.green1} />}
      </TextInputContainer>

      <Text size={1}>
        <strong>Characters:</strong> {value.length}
      </Text>
    </Stack>
  );
};

const TextInputContainer = styled.div`
  position: relative;

  svg {
    position: absolute;
    right: 4px; // TODO: see if we can convert this to space[X]
    top: 50%;
    transform: translate(-50%, -50%);
  }
`;
