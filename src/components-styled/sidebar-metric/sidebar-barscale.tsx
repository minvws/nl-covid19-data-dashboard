import { get } from 'lodash';
import { BarScale } from '~/components/barScale';
import siteText from '~/locale/index';
import { assert } from '~/utils/assert';
import { Box } from '../base';
import { BarScaleConfig } from './data-config';

interface SidebarBarScaleProps {
  config: BarScaleConfig;
  value: number;
  localeTextKey: string;
  /**
   * A unique id is required for path rendering and should be constant between
   * server and client side rendering
   */
  uniqueId: string;
}

export function SidebarBarScale({
  value,
  config,
  localeTextKey,
  uniqueId,
}: SidebarBarScaleProps) {
  const text = get(siteText, localeTextKey);

  assert(text, `No text found for locale key ${localeTextKey}`);
  assert(
    text.barscale_screenreader_text,
    `Missing screen reader text at ${localeTextKey}.barscale_screenreader_text`
  );

  assert(config.rangesKey, `Missing ranges key for bar scale ${localeTextKey}`);

  /**
    @TODO refactor BarScale and remove these ugly css hacks which were part of
    the metric-wrapper class.
    */
  return (
    <Box height="3.5rem" mt="-1.25em">
      <BarScale
        min={config.min}
        max={config.max}
        signaalwaarde={config.signaalwaarde}
        screenReaderText={text.barscale_screenreader_text}
        value={value}
        id={uniqueId}
        rangeKey={config.rangesKey}
        gradient={config.gradient}
        showValue={false}
      />
    </Box>
  );
}
