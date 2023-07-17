import { SeverityLevels } from '~/components/severity-indicator-tile/types';
import { ThermometerConfig } from '~/queries/query-types';

/**
 * Get the current severity level of the thermomemeter and the severity level text
 */
export function getThermometerSeverityLevels(thermometer: ThermometerConfig) {
  const currentSeverityLevel = thermometer.currentLevel as unknown as SeverityLevels;
  const currentSeverityLevelTexts = thermometer.thermometerLevels.find((thermometerLevel) => thermometerLevel.level === currentSeverityLevel);

  return { currentSeverityLevel, currentSeverityLevelTexts };
}
