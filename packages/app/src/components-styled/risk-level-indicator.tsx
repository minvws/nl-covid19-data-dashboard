import css from '@styled-system/css';
import { ReactNode } from 'react';
import styled from 'styled-components';
import Stopwatch from '~/assets/stopwatch.svg';
import { Box } from '~/components-styled/base';
import { Heading, Text } from '~/components-styled/typography';
import { regionThresholds } from '~/components/choropleth/region-thresholds';
import { EscalationLevel } from '~/domain/restrictions/type';
import { assert } from '~/utils/assert';
import { LinkWithIcon } from '~/components-styled/link-with-icon';
import ArrowIcon from '~/assets/arrow.svg';

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
  escalationTypes: Record<escalationRecord, escalationTypesType>;
  escalationLevel: EscalationLevel | number;
  children?: ReactNode;
  href: string;
}

export function RiskLevelIndicator(props: RiskLevelIndicatorProps) {
  const {
    title,
    description,
    children,
    escalationTypes,
    escalationLevel,
    href,
  } = props;

  const filteredEscalationLevel = escalationThresholds.find(
    (item) => item.threshold === escalationLevel
  );

  assert(filteredEscalationLevel, 'Could not find an escalation level');

  return (
    <Box position="relative" pb={3}>
      <Box
        width="4rem"
        height="4rem"
        position="absolute"
        left={0}
        mr={1}
        mb={2}
      >
        <Stopwatch />
      </Box>
      <Heading level={3} as="h2" py={2} pl={{ _: '3.5rem' }}>
        <LinkWithIcon
          href={href}
          icon={<ArrowIcon css={css({ transform: 'rotate(-90deg)' })} />}
          iconPlacement="right"
          fontWeight="bold"
          headingLink
        >
          {title}
        </LinkWithIcon>
      </Heading>
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
          fontSize={19}
          spacing={3}
          spacingHorizontal
        >
          <span>{escalationLevel}</span>
          <span>{escalationTypes[escalationLevel].titel}</span>
        </Box>
      </Box>

      <Text>
        {description} {escalationLevel}:{' '}
        <EscalationLevelTitle>
          {escalationTypes[escalationLevel].titel.toLowerCase()}
        </EscalationLevelTitle>
      </Text>

      {children}
    </Box>
  );
}

const EscalationLevelTitle = styled.span(
  css({
    fontWeight: 'bold',
  })
);
