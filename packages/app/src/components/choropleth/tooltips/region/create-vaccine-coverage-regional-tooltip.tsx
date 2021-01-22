import {
  RegionsVaccine,
  SafetyRegionProperties,
} from '@corona-dashboard/common';
import { TooltipContent } from '~/components/choropleth/tooltips/tooltipContent';
import { formatPercentage } from '~/utils/formatNumber';

export const createVaccineCoverageRegionalTooltip = () => (
  context: SafetyRegionProperties & RegionsVaccine
) => {
  const { vrname, coverage_percentage } = context;

  return (
    <TooltipContent onSelect={() => void 0} title={vrname}>
      <p className="info-value">{formatPercentage(coverage_percentage)}%</p>
    </TooltipContent>
  );
};
