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
import GetestIcon from '~/assets/test.svg';
import Ziekenhuis from '~/assets/ziekenhuis.svg';
import { ReactNode } from 'react';

interface SafetyRegionRowProps {
  vrData: VrScoreboardData;
  maxHospitalAdmissionsPerMillion: number;
  maxPositiveTestedPer100k: number;
}

export function SafetyRegionRow({
  vrData,
  maxHospitalAdmissionsPerMillion,
  maxPositiveTestedPer100k,
}: SafetyRegionRowProps) {
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
    <Link href={reverserRouter.vr.risiconiveau(vrData.vrCode)} passHref>
      <Box
        as="a"
        color="black"
        fontWeight="bold"
        display={{ _: 'block', lg: 'flex' }}
        width="100%"
        justifyItems="flex-start"
        borderTopColor="lightGray"
        borderTopStyle="solid"
        borderTopWidth="1px"
        css={css({
          cursor: 'pointer',
          textDecoration: 'none',
          '&:hover, &:focus': {
            color: 'blue',
          },
        })}
      >
        <VrLinkCell color={escalationColor}>
          <InlineText>{vrData.safetyRegionName}</InlineText>
        </VrLinkCell>
        <Box
          display={{ _: 'block', sm: 'flex' }}
          flex="2"
          justifyItems="center"
        >
          <BarScaleCell
            value={escalationLevelData.positive_tested_per_100k}
            thresholds={positiveTestedEscalationThresholds}
            maxValue={maxPositiveTestedPer100k}
            icon={
              <GetestIcon
                width="24px"
                height="24px"
                style={{ minWidth: '24px' }}
              />
            }
          />
          <BarScaleCell
            value={escalationLevelData.hospital_admissions_per_million}
            thresholds={hospitalAdmissionsEscalationThresholds}
            maxValue={maxHospitalAdmissionsPerMillion}
            icon={
              <Ziekenhuis
                width="24px"
                height="24px"
                style={{ minWidth: '24px' }}
              />
            }
          />
        </Box>
      </Box>
    </Link>
  );
}

const BarScaleCell = ({
  value,
  thresholds,
  maxValue,
  icon,
}: {
  value: number;
  thresholds: CategoricalBarScaleCategory[];
  maxValue: number;
  icon: ReactNode;
}) => {
  const { formatNumber } = useIntl();

  return (
    <Box
      flex="1"
      display="flex"
      width="100%"
      pb={{ _: 2, lg: 2 }}
      pt={{ _: 0, lg: 2 }}
      color="black"
    >
      <Box
        display={{ _: 'flex', sm: 'none' }}
        alignItems="center"
        mr={1}
        pb={1}
        flexGrow={0}
      >
        {icon}
      </Box>
      <Box
        alignItems="center"
        display="flex"
        justifyContent={{ lg: 'flex-end' }}
        mr="1rem"
        width="2.5em"
      >
        <InlineText fontWeight="bold">{formatNumber(value)}</InlineText>
      </Box>
      <Box pr={{ _: 3, sm: 5 }} pb={2} flexGrow={1}>
        <Box mb={{ _: 2, md: 1 }} width={200}>
          <CategoricalBarScale
            hideLegend
            hideNumbers
            categories={thresholds}
            value={value}
            maxValue={maxValue}
          />
        </Box>
      </Box>
    </Box>
  );
};

const VrLinkCell = styled.div<{ color: string }>((x) =>
  css({
    flex: '0 0 18rem',
    display: 'flex',
    alignItems: 'center',
    mt: asResponsiveArray({ _: 3, lg: 0 }),
    mb: asResponsiveArray({ _: 2, lg: 0 }),
    pr: 2,
    minWidth: '11em',
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
      fill: 'currentColor',
    },
    'a:hover &::after, a:focus &::after': {
      backgroundImage: 'url("/images/chevron.svg")',
    },
  })
);
