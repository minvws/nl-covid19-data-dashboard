import { TooltipContent } from '../tooltip-content';

type InternationalTooltipProps = {
  countryName: string;
};

export function InternationalTooltip(props: InternationalTooltipProps) {
  const { countryName } = props;

  return <TooltipContent title={countryName}></TooltipContent>;
}
