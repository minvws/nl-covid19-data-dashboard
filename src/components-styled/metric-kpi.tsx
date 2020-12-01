import { isDefined } from 'ts-is-present';
import { ValueAnnotation } from '~/components-styled/value-annotation';
import { DifferenceDecimal, DifferenceInteger } from '~/types/data';
import { Box } from './base';
import { DifferenceIndicator } from './difference-indicator';
import { Heading, InlineText } from './typography';

type IProps = {
  title: string;
  absolute?: string;
  percentage?: string;
  description?: string;
  valueAnnotation?: string;
  difference?: DifferenceDecimal | DifferenceInteger;
};

export function MetricKPI(props: IProps) {
  const {
    absolute,
    percentage,
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
        {isDefined(absolute) && (
          <InlineText fontSize={3} fontWeight="bold" margin="0" marginRight={1}>
            {absolute}
          </InlineText>
        )}

        {isDefined(percentage) && (
          <InlineText fontSize={3} fontWeight="bold" margin="0" marginRight={1}>
            ({percentage}%)
          </InlineText>
        )}

        {isDefined(difference) && (
          <Box as="span" fontSize={3} display="flex" alignItems="center">
            <DifferenceIndicator value={difference} isContextSidebar={true} />
          </Box>
        )}

        {isDefined(description) && (
          <InlineText
            display="inline-block"
            margin="0"
            color="annotation"
            fontSize={1}
            marginLeft={2}
          >
            {description}
          </InlineText>
        )}
      </Box>

      {valueAnnotation && <ValueAnnotation>{valueAnnotation}</ValueAnnotation>}
    </Box>
  );
}
