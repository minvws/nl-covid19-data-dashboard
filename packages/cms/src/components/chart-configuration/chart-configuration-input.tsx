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
  Checkbox,
  Flex,
  Grid,
  Label,
  Radio,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TextInput,
} from '@sanity/ui';
import FormField from 'part:@sanity/components/formfields/default';
import React, { useCallback, useMemo, useState } from 'react';
import { isDefined } from 'ts-is-present';
import { dataStructure } from '../../data/data-structure';
import { useChangeMethods } from './hooks/use-change-methods';
import { MetricPropertyConfigForm } from './metric-property-config-form';
import { PropertyInput } from './property-input';
import { SelectInput } from './select-input';
import { TimespanAnnotationConfigurationForm } from './timespan-annotation-configuration-form';

export const ChartConfigurationInput = React.forwardRef(
  (props: any, ref: any) => {
    const { value, onChange } = props;
    const [id, setId] = useState<'config' | 'options'>('config');

    const configuration = JSON.parse(
      value ?? '{}'
    ) as PartialChartConfiguration;

    const [metricProperty, setMetricProperty] = useState<string>('');

    const [
      onChangeProp,
      changeProp,
      onChangeDataOptionProp,
      changeDataOptionProp,
    ] = useChangeMethods(onChange, configuration);

    const areaValues = useMemo(
      () =>
        Object.keys(dataStructure)
          .filter((x) => !x.endsWith('_collection'))
          .map((x) => ({
            value: x,
            label: areaTitles[x as keyof typeof areaTitles],
          })),
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

    const addMetricProperty = useCallback(() => {
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
    }, [configuration]);

    const addTimespanAnnotation = useCallback(() => {
      if (!isDefined(configuration.dataOptions)) {
        configuration.dataOptions = {
          timespanAnnotations: [],
        };
      }
      const newArray = [
        ...(configuration.dataOptions?.timespanAnnotations ?? []),
      ];
      newArray.push({
        fill: 'solid',
        start: Infinity,
        end: Infinity,
      });
      changeDataOptionProp('timespanAnnotations', undefined, newArray);
    }, [configuration]);

    const changeMetricProperty = (index: number) =>
      useCallback(
        (value: MetricPropertyConfig) => {
          const newArray = isDefined(configuration.metricPropertyConfigs)
            ? [...configuration.metricPropertyConfigs]
            : [];
          newArray[index] = value;
          changeProp('metricPropertyConfigs', [], newArray);
        },
        [configuration, index]
      );

    const deleteMetricProperty = (index: number) =>
      useCallback(() => {
        const newArray = isDefined(configuration.metricPropertyConfigs)
          ? [...configuration.metricPropertyConfigs]
          : [];
        newArray.splice(index, 1);
        changeProp('metricPropertyConfigs', [], newArray);
      }, [configuration, index]);

    return (
      <FormField>
        <TextInput
          type="text"
          ref={ref}
          value={value}
          style={{ display: 'none' }}
        />

        <TabList space={2}>
          <Tab
            aria-controls="config-panel"
            id="config-tab"
            label="Configuration"
            onClick={() => setId('config')}
            selected={id === 'config'}
          />
          <Tab
            aria-controls="options-panel"
            id="options-tab"
            label="Options"
            onClick={() => setId('options')}
            selected={id === 'options'}
          />
        </TabList>

        <TabPanel
          aria-labelledby="config-tab"
          hidden={id !== 'config'}
          id="config-panel"
        >
          <Stack space={4} marginTop={2}>
            <PropertyInput
              label="Accessibility key"
              value={configuration.accessibilityKey}
              onChange={onChangeProp('accessibilityKey')}
              onReset={() =>
                changeProp('accessibilityKey', undefined, undefined)
              }
            />
            <PropertyInput
              label="Source key"
              value={configuration.sourceKey}
              onChange={onChangeProp('sourceKey')}
              onReset={() => changeProp('sourceKey', undefined, undefined)}
            />
            <Card padding={[0, 0, 2, 2]}>
              <Flex direction="row" align="center" gap={4}>
                <Flex direction="row" align="center" gap={2}>
                  <Radio
                    checked={configuration.timeframe === 'all'}
                    name="timeframe"
                    value="all"
                    onChange={onChangeProp('timeframe')}
                  />
                  <Label>Toon alles</Label>
                </Flex>
                <Flex direction="row" align="center" gap={2}>
                  <Radio
                    checked={configuration.timeframe === '5weeks'}
                    name="timeframe"
                    value="5weeks"
                    onChange={onChangeProp('timeframe')}
                  />
                  <Label>Toon laatste 5 weken</Label>
                </Flex>
              </Flex>
            </Card>
            <SelectInput
              value={configuration.area}
              placeholder="Selecteer een gebied"
              values={areaValues}
              valueKey="value"
              labelKey="label"
              onChange={(event) => {
                onChangeProp('area', ['metricName'])(event);
              }}
            />
            {configuration.area === 'gm' && (
              <SelectInput
                value={configuration.code}
                placeholder="Selecteer een gemeente"
                values={gmData}
                valueKey="gemcode"
                labelKey="name"
                onChange={onChangeProp('code')}
              />
            )}
            {configuration.area === 'vr' && (
              <SelectInput
                value={configuration.code}
                placeholder="Selecteer een veiligheidsregio"
                values={vrData}
                valueKey="code"
                labelKey="name"
                onChange={onChangeProp('code')}
              />
            )}
            {isDefined(metricNames) && (
              <SelectInput
                value={configuration.metricName}
                placeholder="Selecteer een metriek"
                values={metricNames}
                onChange={onChangeProp('metricName')}
              />
            )}
            {isDefined(metricProperties) && (
              <Flex direction="column" gap={2}>
                <SelectInput
                  value={metricProperty}
                  placeholder="Selecteer een metriek waarde"
                  values={metricProperties}
                  onChange={(event: any) => {
                    setMetricProperty(event.target.value ?? '');
                  }}
                />
                <Box>
                  <Button
                    onClick={addMetricProperty}
                    disabled={metricProperty.length === 0}
                  >
                    Voeg metriek waarde toe
                  </Button>
                </Box>
              </Flex>
            )}
            {isDefined(configuration.metricPropertyConfigs) && (
              <Stack space={4}>
                <Label>Lijn configuraties</Label>
                {configuration.metricPropertyConfigs.map((x, index) => (
                  <MetricPropertyConfigForm
                    propertyConfig={x}
                    key={`${x.propertyName}_${index}`}
                    onChange={changeMetricProperty(index)}
                    onDelete={deleteMetricProperty(index)}
                  />
                ))}
              </Stack>
            )}
          </Stack>
        </TabPanel>
        <TabPanel
          aria-labelledby="options-tab"
          hidden={id !== 'options'}
          id="options-panel"
        >
          <Card marginBottom={3}>
            <Grid gap={[2, 2, 2, 2]}>
              <Label>Value annotation key</Label>
              <TextInput
                type="text"
                value={configuration.dataOptions?.valueAnnotationKey}
                onChange={onChangeDataOptionProp('valueAnnotationKey')}
              />
            </Grid>
          </Card>
          <Card marginBottom={3}>
            <Grid gap={[2, 2, 2, 2]}>
              <Label>Forced maximum value</Label>
              <TextInput
                type="number"
                value={configuration.dataOptions?.forcedMaximumValue}
                onChange={onChangeDataOptionProp('forcedMaximumValue')}
              />
            </Grid>
          </Card>
          <Card marginBottom={3}>
            <Grid gap={[2, 2, 2, 2]}>
              <Label>Value is percentage</Label>
              <Checkbox
                checked={configuration.dataOptions?.isPercentage}
                onChange={() =>
                  changeDataOptionProp(
                    'isPercentage',
                    undefined,
                    !Boolean(configuration.dataOptions?.isPercentage)
                  )
                }
              />
            </Grid>
          </Card>
          <Card marginBottom={3}>
            <Grid gap={[2, 2, 2, 2]}>
              <Label>Render null as zero</Label>
              <Checkbox
                checked={configuration.dataOptions?.renderNullAsZero}
                onChange={() =>
                  changeDataOptionProp(
                    'renderNullAsZero',
                    undefined,
                    !Boolean(configuration.dataOptions?.renderNullAsZero)
                  )
                }
              />
            </Grid>
          </Card>
          <Card>
            <Button onClick={addTimespanAnnotation}>
              Timespan annotation toevoegen
            </Button>
          </Card>
          {isDefined(configuration.dataOptions?.timespanAnnotations) && (
            <Stack space={3}>
              {configuration.dataOptions?.timespanAnnotations.map(
                (x, index) => (
                  <TimespanAnnotationConfigurationForm
                    key={index}
                    timespanConfig={x}
                    onChange={(value) => {
                      const newList = [
                        ...(configuration.dataOptions?.timespanAnnotations ??
                          []),
                      ];
                      newList[index] = value;
                      changeDataOptionProp(
                        'timespanAnnotations',
                        undefined,
                        newList
                      );
                    }}
                    onDelete={() => {
                      const newList = [
                        ...(configuration.dataOptions?.timespanAnnotations ??
                          []),
                      ];
                      newList.splice(index, 1);
                      changeDataOptionProp(
                        'timespanAnnotations',
                        undefined,
                        newList
                      );
                    }}
                  />
                )
              )}
            </Stack>
          )}
        </TabPanel>
      </FormField>
    );
  }
);
