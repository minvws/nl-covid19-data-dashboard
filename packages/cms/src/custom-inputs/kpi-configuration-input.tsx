import {
  areaTitles,
  AreaType,
  gmData,
  PartialKpiConfiguration,
  vrData,
} from '@corona-dashboard/common';
import { Badge, Card, Select, TextInput } from '@sanity/ui';
import FormField from 'part:@sanity/components/formfields/default';
import { PatchEvent, set, unset } from 'part:@sanity/form-builder/patch-event';
import React, { useEffect, useMemo, useState } from 'react';
import { isDefined } from 'ts-is-present';
import { dataStructure } from '../data/data-structure';

export const KpiConfigurationInput = React.forwardRef(
  (props: any, ref: any) => {
    const { value = '{}', type, onChange } = props;

    const configuration = value
      ? (JSON.parse(value) as PartialKpiConfiguration)
      : ({} as PartialKpiConfiguration);
    const [isValidated, setIsValidated] = useState(isValid(configuration));
    const [area, setArea] = useState<AreaType | ''>(configuration.area ?? '');
    const [metricName, setMetricName] = useState<string>(
      configuration.metricName ?? ''
    );
    const [metricProperty, setMetricProperty] = useState<string>(
      configuration.metricProperty ?? ''
    );
    const [code, setCode] = useState<string | undefined>(configuration.code);

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

    useEffect(() => {
      const chartConfig: PartialKpiConfiguration = {
        area: area !== '' ? area : undefined,
        metricName,
        metricProperty,
        code,
      };

      if (isValid(chartConfig)) {
        setIsValidated(true);
        onChange(PatchEvent.from(set(JSON.stringify(chartConfig))));
      } else {
        setIsValidated(false);
      }
    }, [area, metricName, metricProperty, code]);

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
        <Select
          value={area}
          onChange={(event: any) => {
            setArea(event.target.value);
            setMetricName('');
            setCode(undefined);
            onChange(PatchEvent.from(unset()));
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
        {area === 'gm' && (
          <Select
            value={code}
            onChange={(event: any) => setCode(event.target.value)}
          >
            <option value={undefined} disabled hidden>
              Selecteer een gemeente
            </option>
            {gmData.map((x) => (
              <option key={x.gemcode} value={x.gemcode}>
                {x.displayName ?? x.name}
              </option>
            ))}
          </Select>
        )}
        {area === 'vr' && (
          <Select
            value={code}
            onChange={(event: any) => setCode(event.target.value)}
          >
            <option value={undefined} disabled hidden>
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
              value={metricName}
              onChange={(event: any) => {
                setMetricName(event.target.value);
                setMetricProperty('');
                onChange(PatchEvent.from(unset()));
              }}
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
                setMetricProperty(event.target.value);
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
          </>
        )}
      </FormField>
    );
  }
);

function isValid(kpiConfig: PartialKpiConfiguration) {
  if (!isDefined(kpiConfig)) {
    return false;
  }

  return (
    (['nl', 'in'].includes(kpiConfig.area ?? '') ||
      (['gm', 'vr'].includes(kpiConfig.area ?? '') &&
        isDefined(kpiConfig.code))) &&
    kpiConfig.metricName?.length &&
    kpiConfig.metricProperty?.length
  );
}
