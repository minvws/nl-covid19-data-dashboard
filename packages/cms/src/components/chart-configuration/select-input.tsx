import { Card, Select } from '@sanity/ui';
import React, { useMemo } from 'react';
import { isDefined } from 'ts-is-present';

interface SelectInputProps {
  value: string | undefined;
  placeholder: string;
  onChange: (event: any) => void;
  values: any[];
  labelKey?: string;
  valueKey?: string;
}

export function SelectInput(props: SelectInputProps) {
  const { value, values, placeholder, onChange, labelKey, valueKey } = props;

  const dataValues = useValues(values, labelKey, valueKey);

  return (
    <Card>
      <Select value={value ?? ''} onChange={onChange}>
        <option value="" disabled hidden>
          {placeholder}
        </option>
        {dataValues.map((x) => (
          <option key={x.value} value={x.value}>
            {x.label}
          </option>
        ))}
      </Select>
    </Card>
  );
}

interface SelectValue {
  value: string;
  label: string;
}

function useValues(values: any[], labelKey?: string, valueKey?: string) {
  return useMemo(() => {
    if (!isDefined(labelKey) || !isDefined(valueKey)) {
      return values.map<SelectValue>((x: string) => ({ value: x, label: x }));
    }
    return values.map<SelectValue>((x: any) => ({
      value: x[valueKey],
      label: x[labelKey],
    }));
  }, [values, labelKey, valueKey]);
}
