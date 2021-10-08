import {
  areaTitles,
  gmData,
  PartialKpiConfiguration,
  vrData,
} from '@corona-dashboard/common';
import { Select, TextInput } from '@sanity/ui';
import FormField from 'part:@sanity/components/formfields/default';
import { PatchEvent, set } from 'part:@sanity/form-builder/patch-event';
import React, { useMemo } from 'react';
import { isDefined } from 'ts-is-present';
import { dataStructure } from '../data/data-structure';

export const KpiConfigurationInput = React.forwardRef(
  (props: any, ref: any) => {
    const { value = '{}', type, onChange } = props;

    const configuration = value
      ? (JSON.parse(value) as PartialKpiConfiguration)
      : ({} as PartialKpiConfiguration);

    const onChangeProp = (propertyName: keyof PartialKpiConfiguration) => {
      return (event: any) =>
        onChange(
          PatchEvent.from(
            set(
              JSON.stringify({
                ...configuration,
                [propertyName]: event.target.value,
              })
            )
          )
        );
    };

    const areaNames = useMemo(
      () =>
        Object.keys(dataStructure).filter((x) => !x.endsWith('_collection')),
      []
    );
    const metricNames = useMemo(
      () =>
        configuration.area
          ? Object.keys((dataStructure as any)[configuration.area])
          : undefined,
      [configuration.area]
    );
    const metricProperties = useMemo(
      () =>
        configuration.area && configuration.metricName
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
        <Select value={configuration.area} onChange={onChangeProp('area')}>
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
          <Select value={configuration.code} onChange={onChangeProp('code')}>
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
        {configuration.area === 'vr' && (
          <Select value={configuration.code} onChange={onChangeProp('code')}>
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
              value={configuration.metricName}
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
              value={configuration.metricProperty}
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
      </FormField>
    );
  }
);
