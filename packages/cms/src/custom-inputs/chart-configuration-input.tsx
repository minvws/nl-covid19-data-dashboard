import {
  AreaType,
  MetricPropertyConfig,
  PartialChartConfiguration,
} from '@corona-dashboard/common';
import {
  Badge,
  Box,
  Button,
  Card,
  Grid,
  Label,
  Radio,
  Select,
  TextInput,
} from '@sanity/ui';
import FormField from 'part:@sanity/components/formfields/default';
import { PatchEvent, set, unset } from 'part:@sanity/form-builder/patch-event';
import React, { useEffect, useMemo, useState } from 'react';
import { isDefined } from 'ts-is-present';
import { dataStructure } from '../data/data-structure';

const areaTitles = {
  in: 'Internationaal',
  nl: 'Nationaal',
  vr: 'Veiligheidsregio',
  gm: 'Gemeente',
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
    const { value = '{}', type, onChange } = props;

    const configuration = value
      ? (JSON.parse(value) as PartialChartConfiguration)
      : ({} as PartialChartConfiguration);

    const [isValidated, setIsValidated] = useState(isValid(configuration));
    const [accessibilityKey, setAccessibilityKey] = useState<string>(
      configuration.accessibilityKey ?? ''
    );
    const [area, setArea] = useState<AreaType | ''>(configuration.area ?? '');
    const [metricName, setMetricName] = useState<string>(
      configuration.metricName ?? ''
    );
    const [metricProperty, setMetricProperty] = useState<string>('');
    const [metricPropertyConfigs, setMetricPropertyConfigs] = useState<
      MetricPropertyConfig[]
    >(configuration.metricPropertyConfigs ?? []);
    const [timeframe, setTimeframe] = useState<'all' | '5weeks'>(
      configuration.timeframe ?? 'all'
    );

    const onChangeTimeframe = (event: any) => setTimeframe(event.target.value);
    const accessibilityKeyChange = (event: any) =>
      setAccessibilityKey(event.target.value);

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
        {
          propertyName: metricProperty,
          type: 'line',
          curve: 'linear',
          labelKey: '',
        },
      ]);
    };

    useEffect(() => {
      const chartConfig: PartialChartConfiguration = {
        area: area !== '' ? area : undefined,
        metricName,
        metricPropertyConfigs,
        timeframe,
        accessibilityKey,
      };

      if (isValid(chartConfig)) {
        setIsValidated(true);
        onChange(PatchEvent.from(set(JSON.stringify(chartConfig))));
      } else {
        setIsValidated(false);
      }
    }, [area, metricName, metricPropertyConfigs, timeframe, accessibilityKey]);

    return (
      <FormField>
        <TextInput
          type="text"
          ref={ref}
          value={value}
          style={{ display: 'none' }}
        />
        {!isValidated && (
          <Card marginBottom={2}>
            <Badge tone="critical">Incomplete configuratie</Badge>
          </Card>
        )}

        <Card marginBottom={3}>
          <Grid gap={[2, 2, 2, 2]}>
            <Label>Accessibility key</Label>
            <TextInput
              type="text"
              value={accessibilityKey}
              onChange={accessibilityKeyChange}
            />
          </Grid>
        </Card>
        <Card padding={[0, 0, 2, 2]}>
          <Box display="flex" style={{ alignItems: 'center', gap: 10 }}>
            <Radio
              checked={timeframe === 'all'}
              name="timeframe"
              value="all"
              onChange={onChangeTimeframe}
            />
            <Label>Toon alles</Label>
          </Box>
          <Box display="flex" style={{ alignItems: 'center', gap: 10 }}>
            <Radio
              checked={timeframe === '5weeks'}
              name="timeframe"
              value="5weeks"
              onChange={onChangeTimeframe}
            />
            <Label>Toon laatste 5 weken</Label>
          </Box>
        </Card>
        <Select
          value={area}
          onChange={(event: any) => {
            setArea(event.target.value);
            setMetricName('');
            onChange(PatchEvent.from(unset()));
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
              onChange={(event: any) => {
                setMetricName(event.target.value);
                setMetricPropertyConfigs([]);
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
              onChange={(event: any) => {
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
        {isDefined(metricPropertyConfigs) && (
          <Box paddingTop={2}>
            {metricPropertyConfigs.map((x, index) => (
              <MetricPropertyConfigForm
                propertyConfig={x}
                key={`${x.propertyName}_${index}`}
                onChange={(value) => {
                  const newArray = [...metricPropertyConfigs];
                  newArray[index] = value;
                  setMetricPropertyConfigs(newArray);
                }}
                onDelete={() => {
                  const newArray = [...metricPropertyConfigs];
                  newArray.splice(index, 1);
                  setMetricPropertyConfigs(newArray);
                }}
              />
            ))}
          </Box>
        )}
      </FormField>
    );
  }
);

type MetricPropertyConfigFormProps = {
  propertyConfig: MetricPropertyConfig;
  onChange: (value: MetricPropertyConfig) => void;
  onDelete: () => void;
};

const typesWithCurve = ['line', 'area', 'gapped-line'];

const MetricPropertyConfigForm = (props: MetricPropertyConfigFormProps) => {
  const { propertyConfig, onChange, onDelete } = props;

  const onChangeType = (event: any) => {
    onChange({
      ...propertyConfig,
      curve: typesWithCurve.includes(event.target.value) ? 'linear' : undefined,
      type: event.target.value,
    });
  };

  const onLabelKeyChange = (event: any) => {
    onChange({
      ...propertyConfig,
      labelKey: event.target.value,
    });
  };

  const onChangeCurve = (event: any) => {
    onChange({
      ...propertyConfig,
      curve: event.target.value,
    });
  };

  return (
    <Card border={true} padding={[1, 1, 1, 1]}>
      <Label>
        {propertyConfig.propertyName} <Button onClick={onDelete}>X</Button>
      </Label>
      <Card
        display="flex"
        style={{ alignItems: 'center', gap: 10 }}
        padding={[0, 0, 2, 2]}
      >
        <Label>Label key:</Label>
        <TextInput
          value={propertyConfig.labelKey}
          onChange={onLabelKeyChange}
        />
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
            <Label>Step</Label>
          </Box>
        </Card>
      )}
    </Card>
  );
};

function isValid(chartConfig: PartialChartConfiguration) {
  if (!isDefined(chartConfig)) {
    return false;
  }
  return (
    isDefined(chartConfig.accessibilityKey) &&
    chartConfig.accessibilityKey?.length > 0 &&
    isDefined(chartConfig.area) &&
    isDefined(chartConfig.metricName) &&
    isDefined(chartConfig.timeframe) &&
    (chartConfig.metricPropertyConfigs?.length ?? 0) > 0 &&
    chartConfig.metricPropertyConfigs?.every((x) => x.labelKey?.length > 0)
  );
}
