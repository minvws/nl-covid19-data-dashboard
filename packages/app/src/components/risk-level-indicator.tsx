import { ReactNode } from 'react';
import Stopwatch from '~/assets/stopwatch.svg';
import { ArrowIconRight } from '~/components/arrow-icon';
import { Box } from '~/components/base';
import { vrThresholds } from '~/components/choropleth/logic';
import { HeadingLinkWithIcon } from '~/components/link-with-icon';
import { Heading, InlineText, Text } from '~/components/typography';
import { EscalationLevel } from '~/domain/restrictions/types';
import { assert } from '~/utils/assert';

const escalationThresholds = vrThresholds.escalation_levels.level;

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
    <Box position="relative" spacing={2} pb={3}>
      <Box width="4rem" height="4rem" position="absolute" left={0}>
        <Stopwatch />
      </Box>

      <Heading level={3} as="h2">
        <Box as="span" display="block" py={2} pl="3.5rem" fontWeight="bold">
          <HeadingLinkWithIcon
            href={href}
            icon={<ArrowIconRight />}
            iconPlacement="right"
          >
            {title}
          </HeadingLinkWithIcon>
        </Box>
      </Heading>

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
        spacingHorizontal={3}
      >
        <span>{level}</span>
        <span>{levelTitle}</span>
      </Box>

      <Text>
        {description} {level}:{' '}
        <InlineText textTransform="lowercase" fontWeight="bold">
          {levelTitle}
        </InlineText>
      </Text>

      {children}
    </Box>
  );
}
