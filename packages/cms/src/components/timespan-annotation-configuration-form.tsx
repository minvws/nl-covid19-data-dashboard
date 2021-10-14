import { TimespanAnnotationConfiguration } from '@corona-dashboard/common';
import {
  Box,
  Button,
  Card,
  Flex,
  Grid,
  Label,
  Select,
  TextInput,
} from '@sanity/ui';
import React from 'react';

interface TimespanAnnotationConfigurationFormProps {
  timespanConfig: TimespanAnnotationConfiguration;
  onChange: (value: TimespanAnnotationConfiguration) => void;
  onDelete: () => void;
}

const fills = ['solid', 'hatched', 'dotted'];

export function TimespanAnnotationConfigurationForm(
  props: TimespanAnnotationConfigurationFormProps
) {
  const { timespanConfig, onChange, onDelete } = props;

  const onChangeProp = (
    propertyName: keyof TimespanAnnotationConfiguration
  ) => {
    return (event: any) => {
      onChange({
        ...timespanConfig,
        [propertyName]: event.target.value,
      });
    };
  };

  return (
    <Card border={true} padding={[1, 1, 1, 1]}>
      <Card marginBottom={3}>
        <Button onClick={onDelete}>X</Button>
      </Card>
      <Card marginBottom={3}>
        <Grid gap={[2, 2, 2, 2]}>
          <Label>Fill</Label>
          <Select
            value={timespanConfig.fill ?? ''}
            onChange={onChangeProp('fill')}
          >
            <option value="">Selecteer fill waarde</option>
            {fills.map((x) => (
              <option value={x} key={x}>
                {x}
              </option>
            ))}
          </Select>
        </Grid>
      </Card>
      <Card marginBottom={3}>
        <Grid gap={[2, 2, 2, 2]}>
          <Label>Start index</Label>
          <TextInput
            type="number"
            value={timespanConfig.start ?? 0}
            onChange={onChangeProp('start')}
          />
        </Grid>
      </Card>
      <Card marginBottom={3}>
        <Grid gap={[2, 2, 2, 2]}>
          <Label>End index</Label>
          <TextInput
            type="number"
            value={timespanConfig.end ?? Infinity}
            onChange={onChangeProp('end')}
          />
        </Grid>
      </Card>
      <Card padding={[1, 1, 1, 1]}>
        <Flex align="flex-start" gap={2} style={{ alignItems: 'center' }}>
          <Label>Label key:</Label>
          <Box style={{ width: '100%' }}>
            <TextInput
              value={timespanConfig.labelKey}
              onChange={onChangeProp('labelKey')}
            />
          </Box>
        </Flex>
      </Card>
      <Card padding={[1, 1, 1, 1]}>
        <Flex align="flex-start" gap={2} style={{ alignItems: 'center' }}>
          <Label>Short label key:</Label>
          <Box style={{ width: '100%' }}>
            <TextInput
              value={timespanConfig.shortLabelKey}
              onChange={onChangeProp('shortLabelKey')}
            />
          </Box>
        </Flex>
      </Card>
    </Card>
  );
}
