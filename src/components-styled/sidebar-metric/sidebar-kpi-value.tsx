import { isDefined } from 'ts-is-present';
import { ValueAnnotation } from '~/components-styled/value-annotation';
import { DifferenceDecimal, DifferenceInteger } from '~/types/data';
import { formatNumber, formatPercentage } from '~/utils/formatNumber';
import { Box } from '../base';
import { DifferenceIndicator } from '../difference-indicator';
import { Heading, InlineText } from '../typography';

type SidebarKpiValueProps = {
  title: string;
  value: number;
  description: string;
  valueAnnotation?: string;
  difference?: DifferenceDecimal | DifferenceInteger;
  isPercentage?: boolean;
};

export function SidebarKpiValue(props: SidebarKpiValueProps) {
  const {
    value,
    isPercentage,
    title,
    description,
    valueAnnotation,
    difference,
  } = props;

  return (
    <Box width="100%" minHeight="4rem">
      <Heading
        level={4}
        fontSize={2}
        fontWeight="normal"
        marginBottom={3}
        marginTop="0"
        as="div"
      >
        {title}
      </Heading>
      <Box display="flex" alignItems="center" justifyContent="flex-start">
        <InlineText fontSize={3} fontWeight="bold" margin="0" marginRight={1}>
          {isPercentage ? `${formatPercentage(value)}%` : formatNumber(value)}
        </InlineText>

        {isDefined(difference) && (
          <Box as="span" fontSize={3} display="flex" alignItems="center">
            <DifferenceIndicator value={difference} isContextSidebar={true} />
          </Box>
        )}

        <InlineText
          display="inline-block"
          margin="0"
          color="annotation"
          fontSize={1}
          marginLeft={2}
        >
          {description}
        </InlineText>
      </Box>

      {valueAnnotation && <ValueAnnotation>{valueAnnotation}</ValueAnnotation>}
    </Box>
  );
}
