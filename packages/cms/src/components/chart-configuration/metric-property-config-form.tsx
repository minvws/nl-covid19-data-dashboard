import { MetricPropertyConfig } from '@corona-dashboard/common';
import { Box, Button, Card, Flex, Label, Radio, Stack } from '@sanity/ui';
import React from 'react';
import { ChartColorInput } from './chart-color-input';
import { PropertyInput } from './property-input';
import { SelectInput } from './select-input';

type MetricPropertyConfigFormProps = {
  propertyConfig: MetricPropertyConfig;
  onChange: (value: MetricPropertyConfig) => void;
  onDelete: () => void;
};

const typesWithCurve = ['line', 'area', 'gapped-line'];
const typesWithBlendMode = ['stacked-area', 'gapped-stacked-area'];
const blendModes = [
  'color',
  'color-burn',
  'color-dodge',
  'darken',
  'difference',
  'exclusion',
  'hard-light',
  'hue',
  'lighten',
  'luminosity',
  'multiply',
  'normal',
  'overlay',
  'saturation',
  'screen',
  'soft-light',
];

const chartTypes = [
  'line',
  'gapped-line',
  'area',
  'bar',
  'range',
  'stacked-area',
  'gapped-stacked-area',
  'invisible',
];

export function MetricPropertyConfigForm(props: MetricPropertyConfigFormProps) {
  const { propertyConfig, onChange, onDelete } = props;

  const onChangeType = (event: any) => {
    onChange({
      ...propertyConfig,
      curve: typesWithCurve.includes(event.target.value) ? 'linear' : undefined,
      mixBlendMode: undefined,
      type: event.target.value,
    });
  };

  const onChangeProp = (propertyName: keyof MetricPropertyConfig) => {
    return (event: any) => changeProp(propertyName, event.target.value);
  };

  const changeProp = (propertyName: keyof MetricPropertyConfig, value: any) => {
    onChange({
      ...propertyConfig,
      [propertyName]: value,
    });
  };

  const onchangeColor = (color: string | undefined) => {
    onChange({
      ...propertyConfig,
      color,
    });
  };

  return (
    <Card border={true} padding={[2, 2, 2, 2]}>
      <Stack space={3}>
        <Card>
          <Label width="100%">
            Property: {propertyConfig.propertyName}
            <Button style={{ marginLeft: '1em' }} onClick={onDelete}>
              X
            </Button>
          </Label>
        </Card>
        <PropertyInput
          label="Label key"
          value={propertyConfig.labelKey}
          onChange={onChangeProp('labelKey')}
          onReset={() => changeProp('labelKey', undefined)}
        />
        <PropertyInput
          label="Short label key"
          value={propertyConfig.shortLabelKey}
          onChange={onChangeProp('shortLabelKey')}
          onReset={() => changeProp('shortLabelKey', undefined)}
        />
        <SelectInput
          value={propertyConfig.type}
          placeholder="Selecteer een type"
          values={chartTypes}
          onChange={onChangeType}
        />
        <Card
          display="flex"
          style={{ alignItems: 'center', gap: 10 }}
          padding={[0, 0, 2, 2]}
        >
          <Box display="flex" style={{ width: '100%' }}>
            <Stack style={{ width: '50%' }} space={2}>
              <Label>Kleur:</Label>
              <ChartColorInput
                value={propertyConfig.color}
                onChange={onchangeColor}
              />
            </Stack>
            <Stack style={{ width: '50%', borderLeft: '1px solid lightGray' }}>
              {typesWithCurve.includes(propertyConfig.type) && (
                <Card padding={[0, 0, 2, 2]}>
                  <Stack space={2}>
                    <Label>Lijn stijl:</Label>
                    <Flex style={{ alignItems: 'center', gap: 10 }}>
                      <Radio
                        checked={propertyConfig.curve === 'linear'}
                        name={`${propertyConfig.propertyName}_curve`}
                        value="linear"
                        onChange={onChangeProp('curve')}
                      />
                      <Label>Linear</Label>
                    </Flex>
                    <Flex style={{ alignItems: 'center', gap: 10 }}>
                      <Radio
                        checked={propertyConfig.curve === 'step'}
                        name={`${propertyConfig.propertyName}_curve`}
                        value="step"
                        onChange={onChangeProp('curve')}
                      />
                      <Label>Step</Label>
                    </Flex>
                  </Stack>
                </Card>
              )}
            </Stack>
          </Box>
        </Card>
        {typesWithBlendMode.includes(propertyConfig.type) && (
          <SelectInput
            placeholder="Selecteer een blend mode"
            value={propertyConfig.mixBlendMode}
            onChange={onChangeProp('mixBlendMode')}
            values={blendModes}
          />
        )}
        <PropertyInput
          label="Fill opacity"
          value={propertyConfig.fillOpacity}
          onChange={onChangeProp('fillOpacity')}
          onReset={() => changeProp('fillOpacity', undefined)}
          inputProps={{
            type: 'number',
            min: 0,
            max: 1,
            step: 0.1,
          }}
        />
        <PropertyInput
          label="Stroke Width"
          value={propertyConfig.strokeWidth}
          onChange={onChangeProp('strokeWidth')}
          onReset={() => changeProp('strokeWidth', undefined)}
          inputProps={{
            type: 'number',
            min: 0,
            max: 100,
            step: 1,
          }}
        />
      </Stack>
    </Card>
  );
}
