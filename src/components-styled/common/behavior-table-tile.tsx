import { NationalBehaviorValue, RegionalBehaviorValue } from '~/types/data';
import { PercentageBar } from '../percentage-bar';
import { Tile } from '../layout';
import { ReactNode, useState } from 'react';
import { formatPercentage } from '~/utils/formatNumber';
import { BehaviorTypeControls } from '../behavior-type-controls';
import styled from 'styled-components';
import css from '@styled-system/css';
import text from '~/locale/index';
import PijlOmhoog from '~/assets/pijl_omhoog.svg';
import PijlOmlaag from '~/assets/pijl_omlaag.svg';
import Gelijk from '~/assets/gelijk.svg';

import wash_hands from '~/assets/gedrag/wash_hands.svg';
import keep_distance from '~/assets/gedrag/keep_distance.svg';
import work_from_home from '~/assets/gedrag/work_from_home.svg';
import avoid_crowds from '~/assets/gedrag/avoid_crowds.svg';
import symptoms_stay_home from '~/assets/gedrag/symptoms_stay_home.svg';
import symptoms_get_tested from '~/assets/gedrag/symptoms_get_tested.svg';
import wear_mask_public_indoors from '~/assets/gedrag/wear_mask_public_indoors.svg';
import wear_mask_public_transport from '~/assets/gedrag/wear_mask_public_transport.svg';
import sneeze_cough_elbow from '~/assets/gedrag/sneeze_cough_elbow.svg';
import max_visitors_home from '~/assets/gedrag/max_visitors_home.svg';

type BehaviorValue = NationalBehaviorValue | RegionalBehaviorValue;

type BehaviorIdentifier =
  | 'wash_hands'
  | 'keep_distance'
  | 'work_from_home'
  | 'avoid_crowds'
  | 'symptoms_stay_home'
  | 'symptoms_get_tested'
  | 'wear_mask_public_indoors'
  | 'wear_mask_public_transport'
  | 'sneeze_cough_elbow'
  | 'max_visitors_home';

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
  behavior: BehaviorValue;
}

interface Behavior {
  id: BehaviorIdentifier;
  icon: ReactNode;
  description: string;
  percentage?: number;
  trend: ReactNode;
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

const Trend = styled.span(
  css({
    svg: {
      color: '#0090DB',
      mr: 1,
      width: '12px',
      verticalAlign: 'middle',
    },
  })
);

const icons: Record<BehaviorIdentifier, () => any> = {
  wash_hands,
  keep_distance,
  work_from_home,
  avoid_crowds,
  symptoms_stay_home,
  symptoms_get_tested,
  wear_mask_public_indoors,
  wear_mask_public_transport,
  sneeze_cough_elbow,
  max_visitors_home,
};

function getIcon(iconName: BehaviorIdentifier): ReactNode {
  const Icon = icons[iconName];
  return <Icon />;
}

function getTrend(trend: Behavior['trend']): ReactNode {
  if (trend === 'up') {
    return (
      <Trend>
        <PijlOmhoog />
        {text.nl_gedrag.basisregels.trend_hoger}
      </Trend>
    );
  }
  if (trend === 'down') {
    return (
      <Trend>
        <PijlOmlaag />
        {text.nl_gedrag.basisregels.trend_lager}
      </Trend>
    );
  }
  return (
    <Trend>
      <Gelijk />
      {text.nl_gedrag.basisregels.trend_gelijk}
    </Trend>
  );
}

function formatBehaviorType(
  behavior: BehaviorValue,
  type: 'compliance' | 'support'
): Behavior[] {
  return behaviorIdentifiers.map((identifier) => {
    const percentage = behavior[
      `${identifier}_${type}` as keyof BehaviorValue
    ] as number | undefined;
    const trend = behavior[
      `${identifier}_${type}_trend` as keyof BehaviorValue
    ] as Behavior['trend'] | undefined;

    return {
      id: identifier,
      description: text.gedrag_onderwerpen[identifier],
      icon: getIcon(identifier),
      percentage,
      trend: getTrend(trend),
    };
  });
}

function sortBehavior(
  compliance: Behavior[],
  support: Behavior[]
): { sortedCompliance: Behavior[]; sortedSupport: Behavior[] } {
  const sortedCompliance = compliance.sort(
    (a, b) => (b.percentage ?? 0) - (a.percentage ?? 0)
  );

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
): { sortedCompliance: Behavior[]; sortedSupport: Behavior[] } {
  const compliance = formatBehaviorType(behavior, 'compliance');
  const support = formatBehaviorType(behavior, 'support');

  return sortBehavior(compliance, support);
}

export function BehaviorTableTile({ behavior }: BehaviorTileProps) {
  const { sortedCompliance, sortedSupport } = formatAndSortBehavior(behavior);
  const [behaviorType, onChangeControls] = useState<'compliance' | 'support'>(
    'compliance'
  );

  return (
    <Tile>
      <h2>Basisregels</h2>
      <BehaviorTypeControls onChange={onChangeControls}></BehaviorTypeControls>
      <p>{text.nl_gedrag.basisregels.intro[behaviorType]}</p>
      <MobileScroll>
        <Table>
          <thead>
            <tr>
              <HeaderCell colSpan={2}>
                {text.nl_gedrag.basisregels.header_percentage}
              </HeaderCell>
              <th></th>
              <HeaderCell>
                {text.nl_gedrag.basisregels.header_basisregel}
              </HeaderCell>
              <HeaderCell>{text.nl_gedrag.basisregels.header_trend}</HeaderCell>
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
              <Cell>{behavior.icon}</Cell>
              <Cell>{behavior.description}</Cell>
              <Cell>{behavior.trend}</Cell>
            </tr>
          ))}
        </Table>
      </MobileScroll>
      <p>{text.nl_gedrag.basisregels.voetnoot[behaviorType]}</p>
    </Tile>
  );
}
