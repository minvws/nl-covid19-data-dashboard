import { NlRiskLevelValue } from '@corona-dashboard/common';
import { Chevron, NederlandGroot } from '@corona-dashboard/icons';
import css from '@styled-system/css';
import styled from 'styled-components';
import { Box } from '~/components/base';
import { LinkWithIcon } from '~/components/link-with-icon';
import { Heading } from '~/components/typography';
import { useIntl } from '~/intl';
import { useBreakpoints } from '~/utils/use-breakpoints';
import { useEscalationLevel } from '~/utils/use-escalation-level';
import { useReverseRouter } from '~/utils/use-reverse-router';
import { EscalationLevelLabel } from './escalation-level-label';

interface EscalationLevelBannerProps {
  data: NlRiskLevelValue;
  hasLink?: boolean;
}

export function EscalationLevelBanner({
  data,
  hasLink,
}: EscalationLevelBannerProps) {
  const { siteText } = useIntl();
  const text = siteText.national_escalation_levels;
  const escalationLevel = useEscalationLevel(data.risk_level);
  const breakpoints = useBreakpoints(true);
  const reverseRouter = useReverseRouter();

  return (
    <Tile sideColor={escalationLevel.color}>
      <Box
        display="flex"
        spacingHorizontal={4}
        alignItems="Center"
        px={4}
        py={3}
      >
        {breakpoints.sm && (
          <Box color={escalationLevel.color} maxWidth="7.5rem" width="100%">
            <NederlandGroot />
          </Box>
        )}

        <Box display="flex" flexDirection="column" spacing={{ sm: 3 }}>
          <Heading level={3}>{text.banner.title}</Heading>
          <Box
            display={{ _: 'flex', sm: undefined }}
            alignItems={{ _: 'center', sm: undefined }}
            spacingHorizontal={{ _: 3, sm: 0 }}
          >
            {!breakpoints.sm && (
              <Box color={escalationLevel.color} maxWidth="6rem" width="100%">
                <NederlandGroot />
              </Box>
            )}
            <EscalationLevelLabel
              level={data.risk_level}
              lastCalculated={data.date_unix}
              validFrom={data.valid_from_unix}
            />
          </Box>

          {hasLink && (
            <LinkWithIcon
              href={reverseRouter.algemeen.overRisiconiveaus()}
              icon={<Chevron />}
              iconPlacement="right"
            >
              {text.banner.link.label}
            </LinkWithIcon>
          )}
        </Box>
      </Box>
    </Tile>
  );
}

const Tile = styled.article<{ sideColor: string }>((x) =>
  css({
    position: 'relative',
    backgroundColor: 'offWhite',
    borderRadius: 1,

    '&:before': {
      content: '""',
      position: 'absolute',
      left: 0,
      top: 0,
      height: ' 100%',
      width: '0.5rem',
      backgroundColor: x.sideColor,
      borderTopLeftRadius: 1,
      borderBottomLeftRadius: 1,
    },
  })
);
