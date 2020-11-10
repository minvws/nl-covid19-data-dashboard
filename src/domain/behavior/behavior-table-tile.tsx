import css from '@styled-system/css';
import { useState } from 'react';
import styled from 'styled-components';
import { Box } from '~/components-styled/base';
import { Tile } from '~/components-styled/layout';
import { PercentageBar } from '~/components-styled/percentage-bar';
import { NationalBehaviorValue, RegionalBehaviorValue } from '~/types/data';
import { formatPercentage } from '~/utils/formatNumber';
import {
  BehaviorIdentifier,
  BehaviorTrendType,
  GedragText,
} from './behavior-types';
import { BehaviorIcon } from './components/behavior-icon';
import { BehaviorTrend } from './components/behavior-trend';
import { BehaviorTypeControls } from './components/behavior-type-controls';
import siteText from '~/locale/index';

type BehaviorValue = NationalBehaviorValue | RegionalBehaviorValue;

const behaviorIdentifiers: BehaviorIdentifier[] = [
  'wash_hands',
  'keep_distance',
  'work_from_home',
  'avoid_crowds',
  'symptoms_stay_home',
  'symptoms_get_tested',
  'wear_mask_public_indoors',
  'wear_mask_public_transport',
  'sneeze_cough_elbow',
  'max_visitors_home',
];

interface BehaviorTileProps {
  text: GedragText;
  behavior: BehaviorValue;
}

interface BehaviorFormatted {
  id: BehaviorIdentifier;
  description: string;
  percentage: number | null;
  trend: BehaviorTrendType;
}

const MobileScroll = styled.div(
  css({
    overflow: 'auto',
  })
);

const Table = styled.table(
  css({
    width: '100%',
  })
);

const HeaderCell = styled.th(
  css({
    px: 3,
    py: 2,
    textAlign: 'left',
  })
);

const Cell = styled.td(
  css({
    borderBottom: '1px solid',
    borderBottomColor: 'lightGrey',
    px: 3,
    py: 2,
  })
);

const Footnote = styled.p(
  css({
    color: 'gray',
  })
);

/* Format raw list of behaviors into list for compliance or for support */
function formatBehaviorType(
  behavior: BehaviorValue,
  type: 'compliance' | 'support'
): BehaviorFormatted[] {
  return behaviorIdentifiers.map((identifier) => {
    const percentage = behavior[
      `${identifier}_${type}` as keyof BehaviorValue
    ] as number | null;
    const trend = behavior[
      `${identifier}_${type}_trend` as keyof BehaviorValue
    ] as BehaviorFormatted['trend'] | null;

    return {
      id: identifier,
      description: siteText.gedrag_onderwerpen[identifier],
      percentage,
      trend,
    };
  });
}

/* Sort lists of formatted compliance and support behaviours */
function sortBehavior(
  compliance: BehaviorFormatted[],
  support: BehaviorFormatted[]
): {
  sortedCompliance: BehaviorFormatted[];
  sortedSupport: BehaviorFormatted[];
} {
  /* Sort compliance on percentage, decreasing; percentage can be null */
  const sortedCompliance = compliance.sort(
    (a, b) => (b.percentage ?? 0) - (a.percentage ?? 0)
  );

  /* Sort support based on the order of compliance */
  const sortedSupport = support.sort((a, b) => {
    return (
      sortedCompliance.findIndex((x) => x.id === a.id) -
      sortedCompliance.findIndex((x) => x.id === b.id)
    );
  });

  return { sortedCompliance, sortedSupport };
}

function formatAndSortBehavior(
  behavior: BehaviorValue
): {
  sortedCompliance: BehaviorFormatted[];
  sortedSupport: BehaviorFormatted[];
} {
  const compliance = formatBehaviorType(behavior, 'compliance');
  const support = formatBehaviorType(behavior, 'support');

  return sortBehavior(compliance, support);
}

export function BehaviorTableTile({ text, behavior }: BehaviorTileProps) {
  const { sortedCompliance, sortedSupport } = formatAndSortBehavior(behavior);
  const [behaviorType, onChangeControls] = useState<'compliance' | 'support'>(
    'compliance'
  );

  return (
    <Tile>
      <h3>{text.basisregels.title}</h3>
      <Box display="flex" justifyContent="start">
        <BehaviorTypeControls
          onChange={onChangeControls}
        ></BehaviorTypeControls>
      </Box>

      <p>{text.basisregels.intro[behaviorType]}</p>
      <MobileScroll>
        <Table>
          <thead>
            <tr>
              <HeaderCell colSpan={2}>
                {text.basisregels.header_percentage}
              </HeaderCell>
              <th></th>
              <HeaderCell>{text.basisregels.header_basisregel}</HeaderCell>
              <HeaderCell>{text.basisregels.header_trend}</HeaderCell>
            </tr>
          </thead>
          {(behaviorType === 'compliance'
            ? sortedCompliance
            : sortedSupport
          ).map((behavior) => (
            <tr key={behavior.id}>
              <Cell>{formatPercentage(behavior.percentage ?? 0)}%</Cell>
              <Cell>
                <PercentageBar percentage={behavior.percentage ?? 0} />
              </Cell>
              <Cell>
                <BehaviorIcon name={behavior.id} />
              </Cell>
              <Cell>{behavior.description}</Cell>
              <Cell>
                <BehaviorTrend text={text} trend={behavior.trend} />
              </Cell>
            </tr>
          ))}
        </Table>
      </MobileScroll>
      <Footnote>{text.basisregels.voetnoot[behaviorType]}</Footnote>
    </Tile>
  );
}
