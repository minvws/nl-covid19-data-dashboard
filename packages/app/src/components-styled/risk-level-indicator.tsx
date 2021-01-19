import styled from 'styled-components';
import css from '@styled-system/css';
import { Link } from '~/utils/link';
import { Text } from '~/components-styled/typography';
import { Box } from '~/components-styled/base';
import Stopwatch from '~/assets/stopwatch.svg';
import { Heading } from '~/components-styled/typography';
import { assert } from '~/utils/assert';
import { EscalationLevel } from '~/components/restrictions/type';
import { regionThresholds } from '~/components/choropleth/region-thresholds';

const escalationThresholds =
  regionThresholds.escalation_levels.escalation_level;

type escalationTypesType = {
  titel: string;
  toelichting: string;
};

type escalationRecord = EscalationLevel | number;

interface RiskLevelIndicatorProps {
  title: string;
  description: string;
  code: string;
  link: {
    title: string;
    href: string;
  };
  escalationTypes: Record<escalationRecord, escalationTypesType>;
  escalationLevel: EscalationLevel | number;
}

export function RiskLevelIndicator(props: RiskLevelIndicatorProps) {
  const { title, description, link, escalationTypes, escalationLevel } = props;

  const filteredEscalationLevel = escalationThresholds.find(
    (item) => item.threshold === escalationLevel
  );

  assert(filteredEscalationLevel, 'Could not find an escalation level');

  return (
    <>
      <Box display="flex" alignItems="center" mb={3}>
        <Stopwatch />
        <Heading level={4} as="h2" mb="0" pl={3}>
          {title}
        </Heading>
      </Box>
      <Box>
        <Box
          backgroundColor={filteredEscalationLevel.color}
          py={1}
          px={3}
          borderRadius="1rem"
          textAlign="center"
          display="inline-block"
          color="#fff"
          fontWeight="bold"
        >
          {`${escalationLevel} ${escalationTypes[escalationLevel].titel}`}
        </Box>
      </Box>

      <Text mb="0">{description}</Text>
      <Text mt="0">
        {`${escalationLevel}: `}
        <EscalationLevelTitle>
          {escalationTypes[escalationLevel].titel.toLowerCase()}
        </EscalationLevelTitle>
      </Text>
      <Link href={link.href}>
        <Text as="a" href={link.href}>
          {link.title}
        </Text>
      </Link>
    </>
  );
}

const EscalationLevelTitle = styled.span(
  css({
    fontWeight: 'bold',
  })
);
