import { Select } from '@sanity/ui';
import FormField from 'part:@sanity/components/formfields/default';
import { PatchEvent, set, unset } from 'part:@sanity/form-builder/patch-event';
import React, { useMemo, useState } from 'react';
import { isDefined } from 'ts-is-present';
import { dataStructure } from '../data/data-structure';

const areaTitles = {
  in: 'Internationaal',
  nl: 'Nationaal',
  vr: 'Veiligheidsregio',
  gm: 'Gemeente',
};

export const ChartConfigurationInput = React.forwardRef(
  (props: any, ref: any) => {
    const { value, type, onChange } = props;
    const [areaValue, metricNameValue, metricPropertyValue] = (
      value ?? ''
    ).split('___');
    console.dir(areaValue);

    const [area, setArea] = useState<string>(areaValue);
    const [metricName, setMetricName] = useState<string>(metricNameValue);
    const [metricProperty, setMetricProperty] =
      useState<string>(metricPropertyValue);

    const areaNames = useMemo(
      () =>
        Object.keys(dataStructure).filter((x) => !x.endsWith('_collection')),
      [dataStructure]
    );
    const metricNames = useMemo(
      () => (area ? Object.keys((dataStructure as any)[area]) : undefined),
      [dataStructure, area]
    );
    const metricProperties = useMemo(
      () =>
        area && metricName
          ? (dataStructure as any)[area][metricName]
          : undefined,
      [dataStructure, area, metricName]
    );

    return (
      <FormField label={type.title} description={type.description}>
        <Select
          value={area}
          onChange={(event) => {
            setArea(event.target.value);
            setMetricName('');
            setMetricProperty('');
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
              onChange={(event) => {
                setMetricName(event.target.value);
                setMetricProperty('');
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
                onChange(
                  PatchEvent.from(
                    set(`${area}___${metricName}___${event.target.value}`)
                  )
                );
              }}
            >
              <option value="" disabled hidden>
                Selecteer een metriek waarde
              </option>
              {metricProperties.map((x: string) => (
                <option value={x}>{x}</option>
              ))}
            </Select>
          </>
        )}
      </FormField>
    );
  }
);
