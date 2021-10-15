import { Box, Button, Card, Flex, Label, TextInput } from '@sanity/ui';
import React from 'react';

interface PropertyInputProps {
  label: string;
  value: any;
  onChange: (event: any) => void;
  onReset: () => void;
  inputProps?: Record<string, any>;
  defaultValue?: string | number;
}

export function PropertyInput(props: PropertyInputProps) {
  const {
    label,
    value,
    onChange,
    onReset,
    inputProps = {
      type: 'text',
    },
    defaultValue = '',
  } = props;

  return (
    <Card>
      <Flex direction="column" gap={2}>
        <Label>{label}</Label>
        <Flex
          align="stretch"
          justify="center"
          gap={1}
          style={{ height: '2em' }}
        >
          <Box flex={1}>
            <TextInput
              value={value ?? defaultValue}
              onChange={onChange}
              {...inputProps}
            />
          </Box>
          <Box>
            <Button
              onClick={onReset}
              title={`Reset '${label}'`}
              style={{ height: '100%' }}
            >
              X
            </Button>
          </Box>
        </Flex>
      </Flex>
    </Card>
  );
}
