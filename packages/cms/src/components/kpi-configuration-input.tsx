import {
  areaTitles,
  gmData,
  PartialKpiConfiguration,
  vrData,
} from '@corona-dashboard/common';
import {
  Box,
  Card,
  Checkbox,
  Flex,
  Grid,
  Label,
  Select,
  Text,
  TextInput,
} from '@sanity/ui';
import FormField from 'part:@sanity/components/formfields/default';
import { PatchEvent, set, unset } from 'part:@sanity/form-builder/patch-event';
import React, { useMemo } from 'react';
import { isDefined } from 'ts-is-present';
import { KpiIconInput, KpiIconKey } from '.';
import { dataStructure } from '../data/data-structure';

export const KpiConfigurationInput = React.forwardRef(
  (props: any, ref: any) => {
    const { value = '{}', type, onChange } = props;

    const configuration = value
      ? (JSON.parse(value) as PartialKpiConfiguration)
      : ({} as PartialKpiConfiguration);

    const onChangeProp = (
      propertyName: keyof PartialKpiConfiguration,
      reset: (keyof PartialKpiConfiguration)[] = []
    ) => {
      return (event: any) => {
        if (
          !isDefined(configuration) ||
          configuration[propertyName] === event.target.value
        ) {
          return;
        }
        const newConfiguration = {
          ...configuration,
          [propertyName]: event.target.value,
        };
        reset.forEach((x) => (newConfiguration[x] = undefined));
        onChange(PatchEvent.from(set(JSON.stringify(newConfiguration))));
      };
    };

    const onChangeIcon = (iconName: string) => {
      if (!isDefined(configuration) || configuration.icon === iconName) {
        return;
      }
      if (iconName?.length) {
        const newConfiguration = {
          ...configuration,
          icon: iconName,
        };
        onChange(PatchEvent.from(set(JSON.stringify(newConfiguration))));
      } else {
        onChange(PatchEvent.from(unset()));
      }
    };

    const toggleProp = (propertyName: keyof PartialKpiConfiguration) => {
      return () => {
        const value = isDefined(configuration[propertyName])
          ? !configuration[propertyName]
          : true;
        onChange(
          PatchEvent.from(
            set(
              JSON.stringify({
                ...configuration,
                [propertyName]: value,
              })
            )
          )
        );
      };
    };

    const areaNames = useMemo(
      () =>
        Object.keys(dataStructure).filter((x) => !x.endsWith('_collection')),
      []
    );
    const metricNames = useMemo(() => {
      const areas = configuration.area?.length
        ? (dataStructure as any)[configuration.area]
        : undefined;
      return areas ? Object.keys(areas) : undefined;
    }, [configuration.area]);
    const metricProperties = useMemo(
      () =>
        configuration.area?.length && configuration.metricName?.length
          ? (dataStructure as any)[configuration.area][configuration.metricName]
          : undefined,
      [configuration.area, configuration.metricName]
    );

    return (
      <FormField>
        <TextInput
          type="text"
          ref={ref}
          value={value}
          style={{ display: 'none' }}
        />
        <Select
          value={configuration.area ?? ''}
          onChange={onChangeProp('area', [
            'code',
            'metricName',
            'metricProperty',
          ])}
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
              onChange={(event) =>
                onChangeProp('metricName', ['metricProperty'])(event)
              }
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
              value={configuration.metricProperty ?? ''}
              onChange={onChangeProp('metricProperty')}
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
          </>
        )}
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
        <Card marginBottom={3} marginTop={3}>
          <Grid gap={[2, 2, 2, 2]}>
            <Label>Title key</Label>
            <TextInput
              type="text"
              value={configuration.titleKey ?? ''}
              onChange={onChangeProp('titleKey')}
            />
          </Grid>
        </Card>
        <Card marginBottom={3}>
          <Grid gap={[2, 2, 2, 2]}>
            <Label>Difference key</Label>
            <TextInput
              type="text"
              value={configuration.differenceKey ?? ''}
              onChange={onChangeProp('differenceKey')}
            />
          </Grid>
        </Card>
        <Card marginBottom={3}>
          <Grid gap={[2, 2, 2, 2]}>
            <Label>Icoon</Label>
            <KpiIconInput
              onChange={onChangeIcon}
              value={configuration.icon as KpiIconKey}
            />
          </Grid>
        </Card>
        <Card marginBottom={3}>
          <Flex align="center">
            {!isDefined(configuration.isMovingAverageDifference) && (
              <Checkbox
                indeterminate
                onChange={toggleProp('isMovingAverageDifference')}
              />
            )}
            {isDefined(configuration.isMovingAverageDifference) && (
              <Checkbox
                checked={Boolean(configuration.isMovingAverageDifference)}
                onChange={toggleProp('isMovingAverageDifference')}
              />
            )}
            <Box flex={1} paddingLeft={3}>
              <Text>
                <label htmlFor="checkbox">
                  Dit is een moving average difference
                </label>
              </Text>
            </Box>
          </Flex>
        </Card>
        <Card marginBottom={3}>
          <Flex align="center">
            {!isDefined(configuration.isAmount) && (
              <Checkbox indeterminate onChange={toggleProp('isAmount')} />
            )}
            {isDefined(configuration.isAmount) && (
              <Checkbox
                checked={Boolean(configuration.isAmount)}
                onChange={toggleProp('isAmount')}
              />
            )}
            <Box flex={1} paddingLeft={3}>
              <Text>
                <label htmlFor="checkbox">
                  Dit is een hoeveelheid (amount)
                </label>
              </Text>
            </Box>
          </Flex>
        </Card>
      </FormField>
    );
  }
);
