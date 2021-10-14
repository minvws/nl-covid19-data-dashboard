import { MetricPropertyConfig } from '@corona-dashboard/common';
import {
  Box,
  Button,
  Card,
  Flex,
  Label,
  Radio,
  Select,
  Stack,
  TextInput,
} from '@sanity/ui';
import React from 'react';
import { ChartColorInput } from './chart-color-input';

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
    return (event: any) => {
      onChange({
        ...propertyConfig,
        [propertyName]: event.target.value,
      });
    };
  };

  const onchangeColor = (color: string | undefined) => {
    onChange({
      ...propertyConfig,
      color,
    });
  };

  return (
    <Card border={true} padding={[1, 1, 1, 1]}>
      <Label width="100%">
        Property: {propertyConfig.propertyName}
        <Button style={{ marginLeft: '1em' }} onClick={onDelete}>
          X
        </Button>
      </Label>
      <Card padding={[1, 1, 1, 1]}>
        <Flex align="flex-start" gap={2} style={{ alignItems: 'center' }}>
          <Label>Label key:</Label>
          <Box style={{ width: '100%' }}>
            <TextInput
              value={propertyConfig.labelKey}
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
              value={propertyConfig.shortLabelKey}
              onChange={onChangeProp('shortLabelKey')}
            />
          </Box>
        </Flex>
      </Card>
      <Card
        display="flex"
        style={{ alignItems: 'center', gap: 10 }}
        padding={[0, 0, 2, 2]}
      >
        <Label>Stijl:</Label>
        <Select value={propertyConfig.type} onChange={onChangeType}>
          <option value="" disabled hidden>
            Selecteer een type
          </option>
          {chartTypes.map((x: string) => (
            <option key={x} value={x}>
              {x}
            </option>
          ))}
        </Select>
      </Card>
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
        <Card>
          <Flex align="flex-start" gap={2} style={{ alignItems: 'center' }}>
            <Label>Mix blendmode:</Label>
            <Box>
              <Select
                value={propertyConfig.mixBlendMode}
                onChange={onChangeProp('mixBlendMode')}
              >
                <option value="" disabled hidden>
                  Selecteer een blend mode
                </option>
                {blendModes.map((x: string) => (
                  <option key={x} value={x}>
                    {x}
                  </option>
                ))}
              </Select>
            </Box>
          </Flex>
        </Card>
      )}
      <Card marginBottom={3}>
        <Flex align="flex-start" gap={2} style={{ alignItems: 'center' }}>
          <Label>Fill opacity:</Label>
          <Box style={{ width: '100%' }}>
            <TextInput
              type="number"
              min={0}
              max={1}
              step={0.1}
              value={propertyConfig.fillOpacity ?? 0.2}
              onChange={onChangeProp('fillOpacity')}
            />
          </Box>
        </Flex>
      </Card>
      <Card>
        <Flex align="flex-start" gap={2} style={{ alignItems: 'center' }}>
          <Label>stroke Width:</Label>
          <Box style={{ width: '100%' }}>
            <TextInput
              type="number"
              min={0}
              max={100}
              step={1}
              value={propertyConfig.strokeWidth ?? 1}
              onChange={onChangeProp('strokeWidth')}
            />
          </Box>
        </Flex>
      </Card>
    </Card>
  );
}
