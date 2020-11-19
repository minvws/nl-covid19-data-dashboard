import { ValueAnnotation } from '~/components-styled/value-annotation';
import { Box } from './base';
import { Heading, Text } from './typography';

type IProps = {
  title: string;
  absolute?: string;
  percentage?: string;
  description?: string;
  valueAnnotation?: string;
};

export function MetricKPI(props: IProps) {
  const { absolute, percentage, title, description, valueAnnotation } = props;

  return (
    <Box width="100%" minHeight="4rem">
      <Heading
        level={4}
        fontSize={2}
        fontWeight="normal"
        marginBottom={3}
        marginTop="0"
      >
        {title}
      </Heading>
      <Box display="flex" alignItems="center">
        <Text display="inline-block" fontSize={3} fontWeight="bold" margin="0">
          {absolute}
        </Text>
        {percentage !== undefined && (
          <Text
            display="inline-block"
            fontSize={3}
            fontWeight="bold"
            margin="0"
            marginLeft={1}
          >
            ({percentage}%)
          </Text>
        )}
        <Text
          display="inline-block"
          margin="0"
          marginLeft={3}
          color="annotation"
          fontSize={1}
        >
          {description}
        </Text>
      </Box>
      {valueAnnotation && <ValueAnnotation>{valueAnnotation}</ValueAnnotation>}
    </Box>
  );
}
