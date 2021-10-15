import { Box, Button, Card, Checkbox, Flex, Label } from '@sanity/ui';
import React from 'react';
import { isDefined } from 'ts-is-present';

interface CheckboxInputProps {
  label: string;
  value: any;
  onToggle: () => void;
  onReset: () => void;
}

export function CheckboxInput(props: CheckboxInputProps) {
  const { label, value, onToggle, onReset } = props;

  return (
    <Card>
      <Flex direction="column" gap={2}>
        <Label>{label}</Label>
        <Flex gap={1} align="center">
          <Box>
            <Checkbox
              checked={value}
              onChange={() => onToggle()}
              indeterminate={!isDefined(value)}
            />
          </Box>
          <Box>
            <Button
              onClick={onReset}
              title={`Reset '${label}'`}
              style={{ height: '1em', width: '1em' }}
              padding={1}
            >
              x
            </Button>
          </Box>
        </Flex>
      </Flex>
    </Card>
  );
}
