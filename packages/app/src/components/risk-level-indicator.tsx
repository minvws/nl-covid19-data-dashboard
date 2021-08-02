import css from '@styled-system/css';
import { ReactNode } from 'react';
import styled from 'styled-components';
import Stopwatch from '~/assets/stopwatch.svg';
import { ArrowIconRight } from '~/components/arrow-icon';
import { Box } from '~/components/base';
import { regionThresholds } from '~/components/choropleth/region-thresholds';
import { LinkWithIcon } from '~/components/link-with-icon';
import { Heading, Text } from '~/components/typography';
import { EscalationLevel } from '~/domain/restrictions/types';
import { assert } from '~/utils/assert';

const escalationThresholds = regionThresholds.escalation_levels.level;

interface RiskLevelIndicatorProps {
  title: string;
  description: string;
  code: string;
  level: EscalationLevel;
  levelTitle: string;
  children?: ReactNode;
  href: string;
}

export function RiskLevelIndicator(props: RiskLevelIndicatorProps) {
  const { title, description, children, level, levelTitle, href } = props;

  const filteredEscalationLevel = escalationThresholds.find(
    (item) => item.threshold === level
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
          icon={<ArrowIconRight />}
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
          <span>{level}</span>
          <span>{levelTitle}</span>
        </Box>
      </Box>

      <Text>
        {description} {level}:{' '}
        <EscalationLevelTitle>{levelTitle}</EscalationLevelTitle>
      </Text>

      {children}
    </Box>
  );
}

const EscalationLevelTitle = styled.span(
  css({
    fontWeight: 'bold',
    textTransform: 'lowercase',
  })
);
