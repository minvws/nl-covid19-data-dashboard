import { NederlandGroot } from '@corona-dashboard/icons';
import css from '@styled-system/css';
import styled from 'styled-components';
import { ArrowIconRight } from '~/components/arrow-icon';
import { Box } from '~/components/base';
import { LinkWithIcon } from '~/components/link-with-icon';
import { Heading } from '~/components/typography';
import { EscalationLevelType } from '~/domain/escalation-level/common';
import { useIntl } from '~/intl';
import { useBreakpoints } from '~/utils/use-breakpoints';
import { useEscalationLevel } from '~/utils/use-escalation-level';
import { EscalationLevelLabel } from './escalation-level-label';

interface EscalationLevelBannerProps {
  level: EscalationLevelType;
  date: number;
}

export function EscalationLevelBanner({
  level,
  date,
}: EscalationLevelBannerProps) {
  const { siteText } = useIntl();
  const text = siteText.national_escalation_levels;
  const escalationLevel = useEscalationLevel(level);
  const breakpoints = useBreakpoints(true);

  return (
    <Tile sideColor={escalationLevel.color}>
      {breakpoints.sm ? (
        <Box
          display="flex"
          spacingHorizontal={4}
          alignItems="Center"
          px={4}
          py={3}
        >
          <Box color={escalationLevel.color}>
            <NederlandGroot />
          </Box>

          <Box display="flex" flexDirection="column" spacing={3}>
            <Heading level={3}>{text.banner.title}</Heading>
            <EscalationLevelLabel level={level} date={date} />

            <LinkWithIcon
              href={text.banner.link.href}
              icon={<ArrowIconRight />}
              iconPlacement="right"
              fontWeight="bold"
            >
              {text.banner.link.label}
            </LinkWithIcon>
          </Box>
        </Box>
      ) : (
        <Box py={3} pl={4} pr={3} spacingHorizontal={3}>
          <Heading level={3}>{text.banner.title}</Heading>
          <Box
            display="flex"
            spacingHorizontal={{ _: 3, xs: 4 }}
            alignItems="center"
          >
            <Box color={escalationLevel.color} maxWidth="6rem">
              <NederlandGroot />
            </Box>
            <EscalationLevelLabel level={level} date={date} />
          </Box>

          <LinkWithIcon
            href={text.banner.link.href}
            icon={<ArrowIconRight />}
            iconPlacement="right"
            fontWeight="bold"
          >
            {text.banner.link.label}
          </LinkWithIcon>
        </Box>
      )}
    </Tile>
  );
}

const Tile = styled.article<{ sideColor: string }>((x) =>
  css({
    position: 'relative',
    backgroundColor: 'page',
    borderRadius: 1,

    '&:before': {
      content: '""',
      position: 'absolute',
      left: 0,
      top: 0,
      height: ' 100%',
      width: '0.7rem',
      backgroundColor: x.sideColor,
      borderTopLeftRadius: 1,
      borderBottomLeftRadius: 1,
    },
  })
);
