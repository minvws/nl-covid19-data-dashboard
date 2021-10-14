import {
  areaTitles,
  DataOptionsConfiguration,
  gmData,
  PartialChartConfiguration,
  vrData,
} from '@corona-dashboard/common';
import {
  Box,
  Button,
  Card,
  Checkbox,
  Grid,
  Label,
  Radio,
  Select,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TextInput,
} from '@sanity/ui';
import FormField from 'part:@sanity/components/formfields/default';
import { PatchEvent, set } from 'part:@sanity/form-builder/patch-event';
import React, { useMemo, useState } from 'react';
import { isDefined } from 'ts-is-present';
import { dataStructure } from '../data/data-structure';
import { MetricPropertyConfigForm } from './metric-property-config-form';
import { TimespanAnnotationConfigurationForm } from './timespan-annotation-configuration-form';

export const ChartConfigurationInput = React.forwardRef(
  (props: any, ref: any) => {
    const { value, onChange } = props;
    const [id, setId] = useState<'config' | 'options'>('config');

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

    const onChangeDataOptionProp = (
      propertyName: keyof DataOptionsConfiguration,
      reset: (keyof DataOptionsConfiguration)[] = [],
      explicitValue?: any
    ) => {
      return (event: any) => {
        changeDataOptionProp(
          propertyName,
          reset,
          explicitValue ?? event.target.value
        );
      };
    };

    const changeDataOptionProp = (
      propertyName: keyof DataOptionsConfiguration,
      reset: (keyof DataOptionsConfiguration)[] = [],
      newValue: any
    ) => {
      if (!isDefined(configuration.dataOptions)) {
        configuration.dataOptions = {};
      }
      if (configuration.dataOptions[propertyName] === newValue) {
        console.log('wut?');
        return;
      }
      const newConfiguration = {
        ...configuration,
        dataOptions: {
          ...configuration.dataOptions,
          [propertyName]: newValue,
        },
      };
      reset.forEach((x) => (newConfiguration.dataOptions[x] = undefined));
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

    const addTimespanAnnotation = () => {
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
    };

    return (
      <FormField>
        <TextInput type="text" ref={ref} value={value} />

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
            <Stack paddingTop={2} space={4}>
              <Label>Lijn configuraties</Label>
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
            </Stack>
          )}
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
