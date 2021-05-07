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

  const escalationColor = useEscalationColor(
    vrData.data.level as EscalationLevel
  );

  const reverserRouter = useReverseRouter();

  return (
    <Box
      display={{ _: 'block', lg: 'flex' }}
      width="100%"
      alignItems="center"
      borderBottomColor="lightGray"
      borderBottomStyle="solid"
      borderBottomWidth="1px"
    >
      <LinkBox color={escalationColor}>
        <Link href={reverserRouter.vr.risiconiveau(vrData.vrCode)}>
          <StyledLink>
            <InlineText>{vrData.safetyRegionName}</InlineText>
          </StyledLink>
        </Link>
      </LinkBox>
      <Box display="flex" flex="2">
        <BarScaleCell
          value={vrData.data.positive_tested_per_100k}
          thresholds={positiveTestedEscalationThresholds}
        />
        <BarScaleCell
          value={vrData.data.hospital_admissions_per_million}
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
    <Box flex="1" display="flex" alignItems="center" width="100%">
      <Box
        flex="0.1"
        display={{ _: 'block', lg: 'flex' }}
        justifyContent={{ lg: 'flex-end' }}
        mr={{ _: '1.5rem', lg: '1rem' }}
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

const LinkBox = styled.div<{ color: string }>((x) =>
  css({
    flex: 0.8,
    mt: asResponsiveArray({ _: 4, lg: 0 }),
    '&::before': asResponsiveArray({
      _: undefined,
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
