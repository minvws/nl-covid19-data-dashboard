import css from '@styled-system/css';
import styled from 'styled-components';
import { Box } from '~/components/base';
import {
  CategoricalBarScale,
  CategoricalBarScaleCategory,
} from '~/components/categorical-bar-scale';
import { InlineText } from '~/components/typography';
import { EscalationLevel } from '~/domain/restrictions/type';
import { useIntl } from '~/intl';
import { asResponsiveArray } from '~/style/utils';
import { Link } from '~/utils/link';
import { useEscalationColor } from '~/utils/use-escalation-color';
import { useReverseRouter } from '~/utils/use-reverse-router';
import { VrScoreboardData } from '../';
import { useEscalationThresholds } from '../../thresholds';

export function SafetyRegionRow({ vrData }: { vrData: VrScoreboardData }) {
  const {
    hospitalAdmissionsEscalationThresholds,
    positiveTestedEscalationThresholds,
  } = useEscalationThresholds();

  const escalationLevelData = vrData.data;

  const escalationColor = useEscalationColor(
    escalationLevelData.level as EscalationLevel
  );

  const reverserRouter = useReverseRouter();

  return (
    <Box
      display="flex"
      flexDirection={{ _: 'column', lg: 'row' }}
      width="100%"
      justifyItems="flex-start"
      borderTopColor="lightGray"
      borderTopStyle="solid"
      borderTopWidth="1px"
    >
      <VrLinkCell color={escalationColor}>
        <Link href={reverserRouter.vr.risiconiveau(vrData.vrCode)}>
          <StyledLink>
            <InlineText>{vrData.safetyRegionName}</InlineText>
          </StyledLink>
        </Link>
      </VrLinkCell>
      <Box display="flex" flex="2" justifyItems="center">
        <BarScaleCell
          value={escalationLevelData.positive_tested_per_100k}
          thresholds={positiveTestedEscalationThresholds}
        />
        <BarScaleCell
          value={escalationLevelData.hospital_admissions_per_million}
          thresholds={hospitalAdmissionsEscalationThresholds}
        />
      </Box>
    </Box>
  );
}

const BarScaleCell = ({
  value,
  thresholds,
}: {
  value: number;
  thresholds: CategoricalBarScaleCategory[];
}) => {
  const { formatNumber } = useIntl();

  return (
    <Box flex="1" display="flex" width="100%">
      <Box
        flex="0.1"
        alignItems="center"
        display="flex"
        justifyContent={{ lg: 'flex-end' }}
        mr={{ _: '2.5rem', lg: '1rem' }}
      >
        <InlineText fontWeight="bold">{formatNumber(value)}</InlineText>
      </Box>
      <Box flex="0.9" pr={{ _: 3, lg: 5 }}>
        <CategoricalBarScale
          hideLegend
          hideNumbers
          categories={thresholds}
          value={value}
        />
      </Box>
    </Box>
  );
};

const StyledLink = styled.a(
  css({
    fontSize: 2,
    color: 'black',
    fontWeight: 'bold',
    cursor: 'pointer',
    textDecoration: 'none',
  })
);

const VrLinkCell = styled.div<{ color: string }>((x) =>
  css({
    flex: 0.8,
    display: 'flex',
    alignItems: 'center',
    mt: asResponsiveArray({ _: 4, lg: 0 }),
    '&::before': asResponsiveArray({
      lg: {
        content: '""',
        display: 'inline-block',
        height: '12px',
        width: '12px',
        borderRadius: '50%',
        background: x.color,
        marginRight: '0.5em',
        flexShrink: 0,
      },
    }),
    '&::after': {
      backgroundImage: 'url("/images/chevron-black.svg")',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundSize: '0.9rem 1rem',
      content: '""',
      flex: '0 0 1rem',
      height: '1rem',
      pl: '2rem',
    },
  })
);
