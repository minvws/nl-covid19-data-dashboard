import { TimespanAnnotationConfiguration } from '@corona-dashboard/common';
import { Button, Card, Stack } from '@sanity/ui';
import React from 'react';
import { PropertyInput } from './property-input';
import { SelectInput } from './select-input';

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
    return (event: any) => changeProp(propertyName, event.target.value);
  };

  const changeProp = (
    propertyName: keyof TimespanAnnotationConfiguration,
    value: any
  ) => {
    onChange({
      ...timespanConfig,
      [propertyName]: value,
    });
  };

  return (
    <Card border={true} padding={[1, 1, 1, 1]}>
      <Stack space={3}>
        <Card>
          <Button onClick={onDelete}>X</Button>
        </Card>
        <SelectInput
          value={timespanConfig.fill}
          placeholder="Selecteer fill waarde"
          values={fills}
          onChange={onChangeProp('fill')}
        />
        <PropertyInput
          label="Start index (use negative values to indicate a timespan starting from the end)"
          value={timespanConfig.start}
          onChange={onChangeProp('start')}
          inputProps={{ type: 'number' }}
          onReset={() => changeProp('start', Infinity)}
        />
        <PropertyInput
          label="End index (leave empty when entering negative start values)"
          value={timespanConfig.end}
          onChange={onChangeProp('end')}
          inputProps={{ type: 'number', min: 0 }}
          onReset={() => changeProp('end', Infinity)}
        />
        <PropertyInput
          label="Label key"
          value={timespanConfig.labelKey}
          onChange={onChangeProp('labelKey')}
          onReset={() => changeProp('labelKey', undefined)}
        />
        <PropertyInput
          label="Short label key"
          value={timespanConfig.shortLabelKey}
          onChange={onChangeProp('shortLabelKey')}
          onReset={() => changeProp('shortLabelKey', undefined)}
        />
      </Stack>
    </Card>
  );
}
