import { get } from 'lodash';
import { BarScale } from '~/components/barScale';
import siteText from '~/locale/index';
import { assert } from '~/utils/assert';
import { useComponentId } from '../radio-group';
import { getDataConfig } from './data-config';

interface SidebarBarScaleProps {
  value: number;
  metricName: string;
  metricProperty: string;
  localeTextKey: string;
}

export function SidebarBarScale({
  value,
  metricName,
  metricProperty,
  localeTextKey,
}: SidebarBarScaleProps) {
  const id = useComponentId();
  const { barScale } = getDataConfig(metricName, metricProperty);
  const text = get(siteText, localeTextKey);

  assert(text, `No text found for locale key ${localeTextKey}`);
  assert(
    text.barscale_screenreader_text,
    `Missing screen reader text at ${localeTextKey}.barscale_screenreader_text`
  );

  return (
    <BarScale
      min={barScale.min}
      max={barScale.max}
      signaalwaarde={barScale.signaalwaarde}
      screenReaderText={text.barscale_screenreader_text}
      value={value}
      id={id}
      rangeKey={metricProperty}
      gradient={barScale.gradient}
    />
  );
}
