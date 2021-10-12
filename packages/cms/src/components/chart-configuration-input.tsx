import {
  areaTitles,
  gmData,
  MetricPropertyConfig,
  PartialChartConfiguration,
  vrData,
} from '@corona-dashboard/common';
import {
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
import { PatchEvent, set } from 'part:@sanity/form-builder/patch-event';
import React, { useMemo, useState } from 'react';
import { isDefined } from 'ts-is-present';
import { dataStructure } from '../data/data-structure';

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
    const { value, onChange } = props;

    const configuration = JSON.parse(
      value ?? '{}'
    ) as PartialChartConfiguration;

    const [metricProperty, setMetricProperty] = useState<string>('');

    const onChangeProp = (
      propertyName: keyof PartialChartConfiguration,
      reset: (keyof PartialChartConfiguration)[] = [],
      explicitValue?: any
    ) => {
      return (event: any) => {
        changeProp(propertyName, reset, explicitValue ?? event.target.value);
      };
    };

    const changeProp = (
      propertyName: keyof PartialChartConfiguration,
      reset: (keyof PartialChartConfiguration)[] = [],
      newValue: any
    ) => {
      if (
        !isDefined(configuration) ||
        configuration[propertyName] === newValue
      ) {
        return;
      }
      const newConfiguration = {
        ...configuration,
        [propertyName]: newValue,
      };
      reset.forEach((x) => (newConfiguration[x] = undefined));
      onChange(PatchEvent.from(set(JSON.stringify(newConfiguration))));
    };

    const areaNames = useMemo(
      () =>
        Object.keys(dataStructure).filter((x) => !x.endsWith('_collection')),
      []
    );
    const metricNames = useMemo(() => {
      const areas = configuration.area
        ? (dataStructure as any)[configuration.area]
        : undefined;
      return areas ? Object.keys(areas) : undefined;
    }, [configuration.area]);
    const metricProperties = useMemo(
      () =>
        configuration.area && configuration.metricName
          ? (dataStructure as any)[configuration.area][configuration.metricName]
          : undefined,
      [configuration.area, configuration.metricName]
    );

    const addMetricProperty = () => {
      const newArray = isDefined(configuration.metricPropertyConfigs)
        ? [...configuration.metricPropertyConfigs]
        : [];
      newArray.push({
        propertyName: metricProperty,
        type: 'line',
        curve: 'linear',
        labelKey: '',
      });
      changeProp('metricPropertyConfigs', [], newArray);
    };

    return (
      <FormField>
        <TextInput
          type="text"
          ref={ref}
          value={value}
          style={{ display: 'none' }}
        />

        <Card marginBottom={3}>
          <Grid gap={[2, 2, 2, 2]}>
            <Label>Accessibility key</Label>
            <TextInput
              type="text"
              value={configuration.accessibilityKey}
              onChange={onChangeProp('accessibilityKey')}
            />
          </Grid>
        </Card>
        <Card marginBottom={3} marginTop={3}>
          <Grid gap={[2, 2, 2, 2]}>
            <Label>Source key</Label>
            <TextInput
              type="text"
              value={configuration.sourceKey ?? ''}
              onChange={onChangeProp('sourceKey')}
            />
          </Grid>
        </Card>
        <Card padding={[0, 0, 2, 2]}>
          <Box display="flex" style={{ alignItems: 'center', gap: 10 }}>
            <Radio
              checked={configuration.timeframe === 'all'}
              name="timeframe"
              value="all"
              onChange={onChangeProp('timeframe')}
            />
            <Label>Toon alles</Label>
          </Box>
          <Box display="flex" style={{ alignItems: 'center', gap: 10 }}>
            <Radio
              checked={configuration.timeframe === '5weeks'}
              name="timeframe"
              value="5weeks"
              onChange={onChangeProp('timeframe')}
            />
            <Label>Toon laatste 5 weken</Label>
          </Box>
        </Card>
        <Select
          value={configuration.area ?? ''}
          onChange={(event) => {
            onChangeProp('area', ['metricName'])(event);
          }}
        >
          <option value="" disabled hidden>
            Selecteer een gebied
          </option>
          {areaNames.map((x) => (
            <option key={x} value={x}>
              {(areaTitles as any)[x]}
            </option>
          ))}
        </Select>
        {configuration.area === 'gm' && (
          <Select
            value={configuration.code ?? ''}
            onChange={onChangeProp('code')}
          >
            <option value="" disabled hidden>
              Selecteer een gemeente
            </option>
            {gmData.map((x) => (
              <option key={x.gemcode} value={x.gemcode}>
                {x.displayName ?? x.name}
              </option>
            ))}
          </Select>
        )}
        {configuration.area === 'vr' && (
          <Select
            value={configuration.code ?? ''}
            onChange={onChangeProp('code')}
          >
            <option value="" disabled hidden>
              Selecteer een veiligheidsregio
            </option>
            {vrData.map((x) => (
              <option key={x.code} value={x.code}>
                {x.name}
              </option>
            ))}
          </Select>
        )}
        {isDefined(metricNames) && (
          <>
            <hr />
            <Select
              value={configuration.metricName ?? ''}
              onChange={onChangeProp('metricName')}
            >
              <option value="" disabled hidden>
                Selecteer een metriek
              </option>
              {metricNames.map((x) => (
                <option key={x} value={x}>
                  {x}
                </option>
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
                setMetricProperty(event.target.value ?? '');
              }}
            >
              <option value="" disabled hidden>
                Selecteer een metriek waarde
              </option>
              {metricProperties.map((x: string) => (
                <option key={x} value={x}>
                  {x}
                </option>
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
        {isDefined(configuration.metricPropertyConfigs) && (
          <Box paddingTop={2}>
            {configuration.metricPropertyConfigs.map((x, index) => (
              <MetricPropertyConfigForm
                propertyConfig={x}
                key={`${x.propertyName}_${index}`}
                onChange={(value) => {
                  const newArray = isDefined(
                    configuration.metricPropertyConfigs
                  )
                    ? [...configuration.metricPropertyConfigs]
                    : [];
                  newArray[index] = value;
                  changeProp('metricPropertyConfigs', [], newArray);
                }}
                onDelete={() => {
                  const newArray = isDefined(
                    configuration.metricPropertyConfigs
                  )
                    ? [...configuration.metricPropertyConfigs]
                    : [];
                  newArray.splice(index, 1);
                  changeProp('metricPropertyConfigs', [], newArray);
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
