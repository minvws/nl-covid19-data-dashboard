import css from '@styled-system/css';
import { ReactNode } from 'react';
import styled from 'styled-components';
import { isPresent } from 'ts-is-present';
import GetestIcon from '~/assets/test.svg';
import Ziekenhuis from '~/assets/ziekenhuis.svg';
import { Box } from '~/components/base';
import {
  CategoricalBarScale,
  CategoricalBarScaleCategory,
} from '~/components/categorical-bar-scale';
import { InlineText } from '~/components/typography';
import { useIntl } from '~/intl';
import { asResponsiveArray } from '~/style/utils';
import { Link } from '~/utils/link';
import { useEscalationColor } from '~/utils/use-escalation-color';
import { useReverseRouter } from '~/utils/use-reverse-router';
import { useEscalationThresholds } from '../../thresholds';
import { VrScoreboardData } from '../types';

interface VrRowProps {
  vrData: VrScoreboardData;
  maxHospitalAdmissionsPerMillion: number;
  maxPositiveTestedPer100k: number;
  hideBorder?: boolean;
}

export function VrRow({
  vrData,
  maxHospitalAdmissionsPerMillion,
  maxPositiveTestedPer100k,
  hideBorder,
}: VrRowProps) {
  const {
    hospitalAdmissionsEscalationThresholds,
    positiveTestedEscalationThresholds,
  } = useEscalationThresholds();

  const escalationLevelData = vrData.data;

  const escalationColor = useEscalationColor(escalationLevelData.level);

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
        borderTopWidth={hideBorder ? 0 : '1px'}
        minHeight={48}
        py={3}
        css={css({
          cursor: 'pointer',
          textDecoration: 'none',
          '&:hover, &:focus': {
            color: 'blue',
          },
        })}
        spacing={{ _: 3, lg: 0 }}
      >
        <VrLinkCell
          color={
            escalationLevelData.level === null ? undefined : escalationColor
          }
        >
          <InlineText variant="body1">{vrData.vrName}</InlineText>
        </VrLinkCell>

        {(isPresent(escalationLevelData.positive_tested_per_100k) ||
          isPresent(escalationLevelData.hospital_admissions_per_million)) && (
          <Box
            display={{ _: 'block', sm: 'flex' }}
            flex="2"
            justifyItems="center"
            spacing={{ _: 3, sm: 0 }}
          >
            {isPresent(escalationLevelData.positive_tested_per_100k) && (
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
            )}
            {isPresent(escalationLevelData.hospital_admissions_per_million) && (
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
            )}
          </Box>
        )}
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
    <Box flex="1" display="flex" alignItems="center" width="100%" color="black">
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

      <Box width={200}>
        <CategoricalBarScale
          hideLegend
          hideNumbers
          categories={thresholds}
          value={value}
          maxValue={maxValue}
        />
      </Box>
    </Box>
  );
};

const VrLinkCell = styled.div<{ color?: string }>((x) =>
  css({
    flex: '0 0 18rem',
    display: 'flex',
    alignItems: 'center',
    pr: 2,
    minWidth: '11em',
    '&::before': asResponsiveArray({
      lg: {
        content: x.color ? '""' : undefined,
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
