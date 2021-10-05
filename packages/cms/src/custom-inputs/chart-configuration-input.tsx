import { Box, Button, Card, Label, Radio, Select } from '@sanity/ui';
import FormField from 'part:@sanity/components/formfields/default';
import { PatchEvent, unset } from 'part:@sanity/form-builder/patch-event';
import React, { useMemo, useState } from 'react';
import { isDefined } from 'ts-is-present';
import { dataStructure } from '../data/data-structure';

const areaTitles = {
  in: 'Internationaal',
  nl: 'Nationaal',
  vr: 'Veiligheidsregio',
  gm: 'Gemeente',
};

type AreaType = 'in' | 'nl' | 'vr' | 'gm';

type ChartConfiguration = {
  area?: AreaType;
  metricName?: string;
  metricPropertyConfigs?: MetricPropertyConfig[];
};

type MetricPropertyConfig = {
  propertyName: string;
  type:
    | 'line'
    | 'gapped-line'
    | 'area'
    | 'bar'
    | 'range'
    | 'stacked-area'
    | 'gapped-stacked-area'
    | 'invisible';
  curve?: 'linear' | 'step';
};

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

export const ChartConfigurationInput = React.forwardRef(
  (props: any, ref: any) => {
    const { value, type, onChange } = props;
    const configuration = value
      ? (JSON.parse(value) as ChartConfiguration)
      : ({} as ChartConfiguration);

    const [area, setArea] = useState<AreaType | ''>(configuration.area ?? '');
    const [metricName, setMetricName] = useState<string>(
      configuration.metricName ?? ''
    );
    const [metricProperty, setMetricProperty] = useState<string>('');
    const [metricPropertyConfigs, setMetricPropertyConfigs] = useState<
      MetricPropertyConfig[]
    >(configuration.metricPropertyConfigs ?? []);

    const areaNames = useMemo(
      () =>
        Object.keys(dataStructure).filter((x) => !x.endsWith('_collection')),
      []
    );
    const metricNames = useMemo(
      () => (area ? Object.keys((dataStructure as any)[area]) : undefined),
      [area]
    );
    const metricProperties = useMemo(
      () =>
        area && metricName
          ? (dataStructure as any)[area][metricName]
          : undefined,
      [area, metricName]
    );
    const addMetricProperty = () => {
      setMetricPropertyConfigs((x) => [
        ...x,
        { propertyName: metricProperty, type: 'line', curve: 'linear' },
      ]);
    };

    return (
      <>
        <FormField label={type.title} description={type.description}>
          <Select
            ref={ref}
            value={area}
            onChange={(event) => {
              setArea(event.target.value);
              setMetricName('');
              //onChange(PatchEvent.from(unset()));
            }}
          >
            <option value="" disabled hidden>
              Selecteer een gebied
            </option>
            {areaNames.map((x) => (
              <option value={x}>{(areaTitles as any)[x]}</option>
            ))}
          </Select>
          {isDefined(metricNames) && (
            <>
              <hr />
              <Select
                value={metricName}
                onChange={(event) => {
                  setMetricName(event.target.value);
                  onChange(PatchEvent.from(unset()));
                }}
              >
                <option value="" disabled hidden>
                  Selecteer een metriek
                </option>
                {metricNames.map((x) => (
                  <option value={x}>{x}</option>
                ))}
              </Select>
            </>
          )}
          {isDefined(metricProperties) && (
            <>
              <hr />
              <Select
                value={metricProperty}
                onChange={(event) => {
                  setMetricProperty(event.target.value);
                }}
              >
                <option value="" disabled hidden>
                  Selecteer een metriek waarde
                </option>
                {metricProperties.map((x: string) => (
                  <option value={x}>{x}</option>
                ))}
              </Select>
              <hr />
              <Button
                onClick={addMetricProperty}
                disabled={metricProperty.length === 0}
              >
                Voeg metriek waarde toe
              </Button>
            </>
          )}
        </FormField>
        {isDefined(metricPropertyConfigs) && (
          <>
            {metricPropertyConfigs.map((x, index) => (
              <MetricPropertyConfigForm
                propertyConfig={x}
                key={`${x.propertyName}_${index}`}
                onChange={(value) => {
                  const newArray = [...metricPropertyConfigs];
                  newArray[index] = value;
                  setMetricPropertyConfigs(newArray);
                }}
              />
            ))}
          </>
        )}
      </>
    );
  }
);

type MetricPropertyConfigFormProps = {
  propertyConfig: MetricPropertyConfig;
  onChange: (value: MetricPropertyConfig) => void;
};

const typesWithCurve = ['line', 'area', 'gapped-line'];

const MetricPropertyConfigForm = (props: MetricPropertyConfigFormProps) => {
  const { propertyConfig, onChange } = props;

  const onChangeType = (event: any) => {
    onChange({
      ...propertyConfig,
      curve: typesWithCurve.includes(event.target.value) ? 'linear' : undefined,
      type: event.target.value,
    });
  };

  const onChangeCurve = (event: any) => {
    onChange({
      ...propertyConfig,
      curve: event.target.value,
    });
  };

  return (
    <FormField label="Lijn configuratie">
      <Label>{propertyConfig.propertyName}</Label>
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
            <option value={x}>{x}</option>
          ))}
        </Select>
      </Card>
      {typesWithCurve.includes(propertyConfig.type) && (
        <Card padding={[0, 0, 2, 2]}>
          <Box display="flex" style={{ alignItems: 'center', gap: 10 }}>
            <Radio
              checked={propertyConfig.curve === 'linear'}
              name={`${propertyConfig.propertyName}_curve`}
              value="linear"
              onChange={onChangeCurve}
            />
            <Label>Linear</Label>
          </Box>
          <Box display="flex" style={{ alignItems: 'center', gap: 10 }}>
            <Radio
              checked={propertyConfig.curve === 'step'}
              name={`${propertyConfig.propertyName}_curve`}
              value="step"
              onChange={onChangeCurve}
            />
            <Label>Curve</Label>
          </Box>
        </Card>
      )}
    </FormField>
  );
};
